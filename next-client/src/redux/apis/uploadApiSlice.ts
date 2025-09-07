import { ApiResult } from "@/types/general";
import { apiSlice } from "./apiSlice";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<ApiResult<string>, FormData>({
      query: (formData) => ({
        url: "upload",
        method: "POST",
        body: formData,
      }),
      extraOptions: { isMultipart: true },
    }),
  }),
});

export const { useUploadFileMutation } = uploadApiSlice;
