// ===========================================================================
// Card transactions — constants owned by this module.
//
// Filter options and status vocabularies belong with the screen that renders
// them. Only cross-cutting constants stay in types/constants.ts.
// ===========================================================================

import type { SelectOption } from "@/types/global";

export const TX_TYPE_OPTIONS: SelectOption[] = [
  { value: "", label: "All types" },
  { value: "purchase", label: "Purchase" },
  { value: "refund", label: "Refund" },
  { value: "auth", label: "Authorization" },
];

export const TX_STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All statuses" },
  { value: "Success", label: "Success" },
  { value: "Pending", label: "Pending" },
  { value: "Failed", label: "Failed" },
];

/** "Authorized" rows belong to the Success bucket when filtering. */
export const TX_STATUS_BUCKETS: Record<string, string[]> = {
  Success: ["Success", "Authorized"],
  Pending: ["Pending"],
  Failed: ["Failed"],
};
