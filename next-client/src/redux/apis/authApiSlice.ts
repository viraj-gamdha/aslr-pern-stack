import { apiSlice } from "./apiSlice";
import { setUserInfo, signout } from "../features/authSlice";
import {
  ResetPassInputs,
  SendOTPInputs,
  SigninFormInputs,
  SignupFormInputs,
  UserInfo,
  VerifyEmailOTPInputs,
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
          if (data.success && data.data.accessToken) {
            dispatch(setUserInfo(data.data));
          }
        } catch (error) {
          console.log("Signin Error", error);
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

    requestOTP: builder.mutation<
      ApiResult<{ resendAfter: number }>,
      SendOTPInputs
    >({
      query: (data) => ({
        url: "auth/request_otp",
        method: "POST",
        body: data,
      }),
    }),

    verifyOTP: builder.mutation<ApiResult, VerifyEmailOTPInputs>({
      query: (data) => ({
        url: "auth/verify_user",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<ApiResult, ResetPassInputs>({
      query: (data) => ({
        url: "auth/reset_password",
        method: "POST",
        body: data,
      }),
    }),

    refresh: builder.mutation<ApiResult<UserInfo>, {}>({
      query: () => ({
        url: "auth/refresh_token",
        method: "GET",
      }),

      // we are globally setting user info in to redux
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

    signout: builder.mutation<ApiResult, {}>({
      query: () => ({
        url: "auth/signout",
        method: "POST",
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(signout({}));

            // Optionally clear specific cached queries
            // dispatch(
            //   projectApiSlice.util.updateQueryData(
            //     "getUserProjects",
            //     undefined,
            //     (draft) => {
            //       draft.data = []; // or null, depending on your shape
            //     }
            //   )
            // );

            // Or reset the entire API cache
            dispatch(apiSlice.util.resetApiState());
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
  useRequestOTPMutation,
  useVerifyOTPMutation,
  useRefreshMutation,
  useResetPasswordMutation,
  useSignoutMutation,
} = authApiSlice;
