import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Environment, Tenant, Theme } from "@/types/global";
import { DEFAULT_RANGE_ID } from "@/types/constants";
import { DEFAULT_TENANT } from "@/utils/Config";

interface ConfigState {
  tenant: Tenant;
  theme: Theme;
  rangeId: string;
  sidebarOpen: boolean;
  paletteOpen: boolean;
}

const initialState: ConfigState = {
  tenant: DEFAULT_TENANT,
  theme: "light",
  rangeId: DEFAULT_RANGE_ID,
  sidebarOpen: false,
  paletteOpen: false,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setTenant(state, action: PayloadAction<Tenant>) {
      state.tenant = action.payload;
    },
    setEnvironment(state, action: PayloadAction<Environment>) {
      state.tenant.mode = action.payload;
      state.tenant.environmentLabel =
        action.payload === "live" ? "live environment" : "sandbox environment";
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    setRange(state, action: PayloadAction<string>) {
      state.rangeId = action.payload;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setPaletteOpen(state, action: PayloadAction<boolean>) {
      state.paletteOpen = action.payload;
    },
  },
});

export const {
  setTenant,
  setEnvironment,
  setTheme,
  setRange,
  setSidebarOpen,
  toggleSidebar,
  setPaletteOpen,
} = configSlice.actions;

export default configSlice.reducer;
