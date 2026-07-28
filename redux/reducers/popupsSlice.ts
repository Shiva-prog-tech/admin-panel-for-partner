import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PopupName =
  | "addEndUser"
  | "addCardholder"
  | "issueCard"
  | "createApiKey"
  | "addWebhook"
  | "confirmSuspend"
  | "confirmRevoke"
  | null;

interface PopupsState {
  active: PopupName;
  /** ref id / record id the popup is acting on */
  subject: string | null;
}

const initialState: PopupsState = { active: null, subject: null };

const popupsSlice = createSlice({
  name: "popups",
  initialState,
  reducers: {
    openPopup(
      state,
      action: PayloadAction<{ name: Exclude<PopupName, null>; subject?: string }>
    ) {
      state.active = action.payload.name;
      state.subject = action.payload.subject ?? null;
    },
    closePopup(state) {
      state.active = null;
      state.subject = null;
    },
  },
});

export const { openPopup, closePopup } = popupsSlice.actions;

export default popupsSlice.reducer;
