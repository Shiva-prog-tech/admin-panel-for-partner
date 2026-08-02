import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminUser } from "@/types/global";

interface AuthState {
  user: AdminUser | null;
  status: "idle" | "loading" | "authenticated" | "error";
  error: string | null;
  /** true once the stored session has been read on the client */
  hydrated: boolean;
}

/**
 * Starts signed out. `AuthGate` reads the persisted session on mount and
 * dispatches `sessionRestored`, so the server render and the first client
 * render agree.
 */
const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  hydrated: false,
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
      state.hydrated = true;
    },
    signInFailure(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
      state.hydrated = true;
    },
    /** Applied once per page load, after reading localStorage/sessionStorage. */
    sessionRestored(state, action: PayloadAction<AdminUser | null>) {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "idle";
      state.hydrated = true;
    },
    signOut(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.hydrated = true;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  sessionRestored,
  signOut,
} = authSlice.actions;

export default authSlice.reducer;
