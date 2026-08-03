// ===========================================================================
// Audit log — constants owned by this module.
//
// Filter options and status vocabularies belong with the screen that renders
// them. Only cross-cutting constants stay in types/constants.ts.
// ===========================================================================

import type { SelectOption } from "@/types/global";

export const API_STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All" },
  { value: "2xx", label: "2xx" },
  { value: "400", label: "400" },
  { value: "401", label: "401" },
  { value: "500", label: "500" },
];
