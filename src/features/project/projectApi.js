import { apiSlice } from "../api/apiSlice";

export const projectApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: (email) =>
                `/projects?q=${email}&_sort=createdAt&_order=desc`,
        }),

        addProject: builder.mutation({
            query: (data) => ({
                url: "/projects",
                method: "POST",
                body: data,
            }),
        }),

        editProject: builder.mutation({
            query: ({ id, data }) => ({
                url: `/projects/${id}`,
                method: "PATCH",
                body: data,
            }),
        }),

        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/projects/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useAddProjectMutation,
    useGetProjectsQuery,
    useDeleteProjectMutation,
    useEditProjectMutation,
} = projectApi;
