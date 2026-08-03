// ===========================================================================
// Custody — constants owned by this module.
//
// Filter options and status vocabularies belong with the screen that renders
// them. Only cross-cutting constants stay in types/constants.ts.
// ===========================================================================

import type { SelectOption } from "@/types/global";

export const WITHDRAWAL_STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Processing", label: "Processing" },
  { value: "Approved", label: "Approved" },
  { value: "Completed", label: "Completed" },
  { value: "Failed", label: "Failed" },
];

export const CUSTODY_ASSET_OPTIONS: SelectOption[] = [
  { value: "", label: "All assets" },
  { value: "USDT", label: "USDT" },
  { value: "USDC", label: "USDC" },
  { value: "TRX", label: "TRX" },
  { value: "BTC", label: "BTC" },
];
