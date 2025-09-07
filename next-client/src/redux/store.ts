import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./features/authSlice";
import { apiSlice } from "./apis/apiSlice";
import { editorReducer } from "./features/editorSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      editor: editorReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
