import { ApiResult } from "@/types/general";
import { apiSlice } from "./apiSlice";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<
      ApiResult<string>,
      { projectId: string; data: FormData }
    >({
      query: ({ projectId, data }) => ({
        url: `upload/${projectId}`,
        method: "POST",
        body: data,
      }),
      extraOptions: { isMultipart: true },
    }),
  }),
});

export const { useUploadFileMutation } = uploadApiSlice;
