import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./features/authSlice";
import { authApiSlice } from "./apis/authApiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApiSlice.reducerPath]: authApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApiSlice.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
