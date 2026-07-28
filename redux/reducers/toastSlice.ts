import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ToastMessage } from "@/types/global";

interface ToastState {
  items: ToastMessage[];
  nextId: number;
}

const initialState: ToastState = { items: [], nextId: 1 };

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    pushToast(state, action: PayloadAction<Omit<ToastMessage, "id">>) {
      state.items.push({ id: `t-${state.nextId}`, ...action.payload });
      state.nextId += 1;
      // keep the stack readable
      if (state.items.length > 4) state.items.shift();
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearToasts(state) {
      state.items = [];
    },
  },
});

export const { pushToast, dismissToast, clearToasts } = toastSlice.actions;

export default toastSlice.reducer;
