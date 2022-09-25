import { apiSlice } from "../api/apiSlice";

export const teamApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTeams: builder.query({
            query: (email) => `/teams?q=${email}&_sort=createdAt&_order=desc`,
        }),

        getTeam: builder.query({
            query: (id) => `/teams/${id}`,
        }),

        addTeam: builder.mutation({
            query: (data) => ({
                url: "/teams",
                method: "POST",
                body: data,
            }),
        }),

        editTeam: builder.mutation({
            query: ({ id, email, data }) => ({
                url: `/teams/${id}`,
                method: "PATCH",
                body: data,
            }),
        }),

        deleteTeam: builder.mutation({
            query: (id) => ({
                url: `/teams/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetTeamQuery,
    useGetTeamsQuery,
    useAddTeamMutation,
    useDeleteTeamMutation,
    useEditTeamMutation,
} = teamApi;
