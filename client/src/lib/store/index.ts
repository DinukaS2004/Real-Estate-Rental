import { configureStore } from "@reduxjs/toolkit";
import { propertiesApi } from "../api/propertiesApi";
import { applicationsApi } from "../api/applicationsApi";
import authReducer from "./authSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        [propertiesApi.reducerPath]: propertiesApi.reducer,
        [applicationsApi.reducerPath]: applicationsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(propertiesApi.middleware)
            .concat(applicationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;