// ===========================================================================
// Webhooks — constants owned by this module.
//
// Filter options and status vocabularies belong with the screen that renders
// them. Only cross-cutting constants stay in types/constants.ts.
// ===========================================================================

import type { SelectOption } from "@/types/global";

export const DELIVERY_STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All" },
  { value: "Delivered", label: "Delivered" },
  { value: "Failed", label: "Failed" },
  { value: "Pending", label: "Pending" },
];
