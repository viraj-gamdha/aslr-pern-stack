import { ApiResult } from "@/types/general";
import { apiSlice } from "./apiSlice";
import { projectApiSlice } from "./projectApiSlice";
import { DocumentType } from "@/types/document";
import { JSONContent } from "@tiptap/react";
import { setEditorDirty } from "../features/editorSlice";

export const docApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateDocument: builder.mutation<
      ApiResult<DocumentType>,
      { projectId: string; content: JSONContent }
    >({
      query: ({ projectId, content }) => ({
        url: `documents/${projectId}`,
        method: "PUT",
        body: { content },
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          if (result.success) {
            // first reseting dirty state
            dispatch(setEditorDirty(false));
            dispatch(
              projectApiSlice.util.updateQueryData(
                "getUserProjectById",
                projectId,
                (draft) => {
                  if (draft.data.document) {
                    Object.assign(draft.data.document, result.data);
                  } else {
                    draft.data.document =
                      result.data as typeof draft.data.document;
                  }
                }
              )
            );
          }
        } catch (err) {
          console.error("Failed to update project cache:", err);
        }
      },
    }),
  }),
});

export const { useUpdateDocumentMutation } = docApiSlice;
