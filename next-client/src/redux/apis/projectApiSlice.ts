import { ApiResult } from "@/types/general";
import { apiSlice } from "./apiSlice"; // Assuming you have a base apiSlice
import {
  CreateProjectFormInputs,
  FullProject,
  Project,
  UpdateProjectFormInputs,
} from "@/types/project";

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new project
    createProject: builder.mutation<
      ApiResult<Project>,
      CreateProjectFormInputs
    >({
      query: (data) => ({
        url: "project/create",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          if (result.success) {
            // Append new project to getUserProjects cache
            dispatch(
              projectApiSlice.util.updateQueryData(
                "getUserProjects",
                undefined,
                (draft) => {
                  draft.data.push(result.data);
                }
              )
            );
          }
        } catch (error) {
          console.log("Create Project Error", error);
        }
      },
    }),

    // Update project details
    updateProject: builder.mutation<
      ApiResult<Project>,
      { id: string; data: UpdateProjectFormInputs }
    >({
      query: ({ id, data }) => ({
        url: `project/update/${id}`,
        method: "PUT",
        body: data,
      }),
      // invalidating single project
      // invalidatesTags: (result, error, { id }) =>
      //   result?.success ? [{ type: "Project", id }] : [],
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          if (result.success) {
            // All projects list update
            dispatch(
              projectApiSlice.util.updateQueryData(
                "getUserProjects",
                undefined,
                (draft) => {
                  const project = draft.data.find((p) => p.id === id);
                  if (project) {
                    project.title = result.data.title;
                    project.description = result.data.description;
                  }
                }
              )
            );

            // single project data update
             dispatch(
              projectApiSlice.util.updateQueryData(
                "getUserProjectById",
                id,
                (draft) => {
                  draft.data.title = result.data.title;
                  draft.data.description = result.data.description
                }
              )
            );
          }
        } catch (error) {
          console.log("Update Project Error", error);
        }
      },
    }),

    // Get all user projects
    getUserProjects: builder.query<ApiResult<Project[]>, void>({
      query: () => ({
        url: "project/all",
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),

    // Get a specific project by ID
    getUserProjectById: builder.query<ApiResult<FullProject>, string>({
      query: (id) => ({
        url: `project/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),

    // Delete a project
    deleteProject: builder.mutation<ApiResult<{ id: string }>, string>({
      query: (id) => ({
        url: `project/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          if (result.success) {
            // Remove project from getUserProjects cache
            dispatch(
              projectApiSlice.util.updateQueryData(
                "getUserProjects",
                undefined,
                (draft) => {
                  draft.data = draft.data.filter(
                    (project) => project.id !== id
                  );
                }
              )
            );
            // Invalidate getUserProjectById cache for the deleted project
            dispatch(
              projectApiSlice.util.invalidateTags([{ type: "Project", id }])
            );
          }
        } catch (error) {
          console.log("Delete Project Error", error);
        }
      },
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useGetUserProjectsQuery,
  useGetUserProjectByIdQuery,
  useDeleteProjectMutation,
} = projectApiSlice;
