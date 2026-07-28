import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import configReducer from "./reducers/configSlice";
import filtersReducer from "./reducers/filtersSlice";
import popupsReducer from "./reducers/popupsSlice";
import toastReducer from "./reducers/toastSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      config: configReducer,
      filters: filtersReducer,
      popups: popupsReducer,
      toast: toastReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
