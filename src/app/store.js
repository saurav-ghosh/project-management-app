import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import authSliceReducer from "../features/auth/authSlice";
import filterSliceReducer from "../features/filter/filterSlice";
import projectSliceReducer from "../features/project/projectSlice";
import teamSliceReducer from "../features/team/teamSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        team: teamSliceReducer,
        project: projectSliceReducer,
        filter: filterSliceReducer,
    },

    middleware: (getDefaultMiddlewares) =>
        getDefaultMiddlewares().concat(apiSlice.middleware),
});
