import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data,
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = (await queryFulfilled) || {};

                    localStorage.setItem(
                        "auth",
                        JSON.stringify({
                            accessToken: data.accessToken,
                            user: data.user,
                        })
                    );

                    dispatch(
                        userLoggedIn({
                            accessToken: data.accessToken,
                            user: data.user,
                        })
                    );
                } catch (error) {}
            },
        }),
    }),
});

export const { useLoginMutation } = authApi;
