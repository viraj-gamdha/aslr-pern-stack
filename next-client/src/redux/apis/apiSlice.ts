import {
  type BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { setUserInfo, signout } from "../features/authSlice";
import { UserInfo } from "@/types/user";

// Base query
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers, { getState, extraOptions }) => {
    const headerData = (getState() as RootState).auth.userInfo;
    // Check if the request contains a file
    if ((extraOptions as { isMultipart?: boolean })?.isMultipart) {
      headers.delete("Content-Type"); // Let the browser set it automatically
    } else {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
    }
    if (headerData) {
      headers.set("Authorization", `Bearer ${headerData.accessToken || ""}`);
    }
    return headers;
  },
});

// Reauth for some cases
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  ////access token expired or invalid try to refresh first and try again
  if (result?.error?.status === 403) {
    const refreshResult = await baseQuery(
      "auth/refresh_token",
      api,
      extraOptions
    );

    if (
      refreshResult?.data &&
      typeof refreshResult.data === "object" &&
      "data" in refreshResult.data
    ) {
      // Type assertion here
      const typedData = refreshResult.data as { data: UserInfo };
      api.dispatch(setUserInfo(typedData.data));

      // Retry original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      ///nothing worked just logout user
      if (
        refreshResult?.error?.status === 403 ||
        refreshResult?.error?.status === 401
      ) {
        api.dispatch(signout({}));
      }
      return refreshResult;
    }

    ///refresh token expired or not valid or not found
  } else if (result.error?.status === 401) {
    api.dispatch(signout({}));
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Project", "Projects"],
  endpoints: (_builder) => ({}),
});
