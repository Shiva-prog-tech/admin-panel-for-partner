import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminUser } from "@/types/global";
import { DEFAULT_ADMIN } from "@/utils/Config";

interface AuthState {
  user: AdminUser | null;
  status: "idle" | "loading" | "authenticated" | "error";
  error: string | null;
}

const initialState: AuthState = {
  user: DEFAULT_ADMIN,
  status: "authenticated",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInStart(state) {
      state.status = "loading";
      state.error = null;
    },
    signInSuccess(state, action: PayloadAction<AdminUser>) {
      state.user = action.payload;
      state.status = "authenticated";
      state.error = null;
    },
    signInFailure(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
    },
    signOut(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, signOut } =
  authSlice.actions;

export default authSlice.reducer;
