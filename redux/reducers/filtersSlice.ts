import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** Status filters, keyed by resource so each listing keeps its own selection. */
type FiltersState = Record<string, string[]>;

const initialState: FiltersState = {};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleStatus(
      state,
      action: PayloadAction<{ resource: string; status: string }>
    ) {
      const { resource, status } = action.payload;
      const current = state[resource] ?? [];
      state[resource] = current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status];
    },
    setStatuses(
      state,
      action: PayloadAction<{ resource: string; statuses: string[] }>
    ) {
      state[action.payload.resource] = action.payload.statuses;
    },
    clearFilters(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export const { toggleStatus, setStatuses, clearFilters } = filtersSlice.actions;

/**
 * Shared empty array so an unfiltered resource always selects the *same*
 * reference — returning a fresh `[]` would make useSelector re-render on
 * every store update.
 */
const NO_STATUSES: readonly string[] = Object.freeze([]);

export const selectStatuses =
  (resource: string) =>
  (state: { filters: FiltersState }): readonly string[] =>
    state.filters[resource] ?? NO_STATUSES;

export default filtersSlice.reducer;
