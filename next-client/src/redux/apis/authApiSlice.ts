import { apiSlice } from "./apiSlice";
import { setUserInfo, logout } from "../features/authSlice";
import {
  ForgotPassInputs,
  SigninFormInputs,
  SignupFormInputs,
  UserInfo,
} from "@/types/user";
import { ApiResult } from "@/types/general";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation<ApiResult<UserInfo>, SigninFormInputs>({
      query: (data) => ({
        url: "auth/signin",
        method: "POST",
        body: data,
      }),

      // to run on fetch call
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          //dispatch userInfo (including header data) to global redux store
          dispatch(setUserInfo(data.data));
        } catch (error) {
          console.log("Login Error", error);
        }
      },
    }),

    signup: builder.mutation<ApiResult<UserInfo>, SignupFormInputs>({
      query: (data) => ({
        url: "auth/signup",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<ApiResult, ForgotPassInputs>({
      query: (data) => ({
        url: "auth/forgot_password",
        method: "POST",
        body: data,
      }),
    }),

    ////
    refresh: builder.mutation<ApiResult<UserInfo>, {}>({
      query: () => ({
        url: "auth/refresh_token",
        method: "GET",
      }),

      ///We are globally setting user info in to redux
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          ////user info in data
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(setUserInfo(data.data));
          }
          // Update headers with the new header data
        } catch (err) {
          console.log("Refresh Request Error", err);
        }
      },
    }),

    signout: builder.mutation<ApiResult<{}>, {}>({
      query: () => ({
        url: "auth/signout",
        method: "POST",
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(logout({}));
          }
        } catch (error) {
          console.log("Error signing Out user", error);
        }
      },
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useRefreshMutation,
  useForgotPasswordMutation,
  useSignoutMutation,
} = authApiSlice;
