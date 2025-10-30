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
  // Temp storing original request
  let result = await baseQuery(args, api, extraOptions);

  // If access token is invalid or expired
  if (result?.error?.status === 401) {
    // Attempt to refresh the token
    const refreshResult = await baseQuery(
      "auth/refresh_token",
      api,
      extraOptions
    );

    const refreshedUser = refreshResult?.data as { data?: UserInfo };

    if (refreshedUser?.data) {
      // Update user info and retry original request
      api.dispatch(setUserInfo(refreshedUser.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — logout if token is invalid or expired or just errors
      const status = refreshResult?.error?.status;
      if (status === 401 || status === 403) {
        api.dispatch(signout({}));
      }
      return refreshResult;
    }
  }

  // If access token / refresh token is missing or unauthorized (or no refresh token)
  if (result?.error?.status === 403) {
    api.dispatch(signout({}));
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Project", "Projects"],
  endpoints: (_builder) => ({}),
});
