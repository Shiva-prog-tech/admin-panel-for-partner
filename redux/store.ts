import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/AuthReducer";
import configReducer from "./reducers/ConfigReducer";
import filtersReducer from "./reducers/FiltersReducer";
import popupsReducer from "./reducers/PopUpsReducer";
import toastReducer from "./reducers/ToastReducer";

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
