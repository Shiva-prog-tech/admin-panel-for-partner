// ===========================================================================
// Crypto transactions — constants owned by this module.
//
// Filter options and status vocabularies belong with the screen that renders
// them. Only cross-cutting constants stay in types/constants.ts.
// ===========================================================================

import type { SelectOption } from "@/types/global";

export const CRYPTO_ASSET_OPTIONS: SelectOption[] = [
  { value: "", label: "All assets" },
  { value: "USDT", label: "USDT" },
  { value: "USDC", label: "USDC" },
  { value: "TRX", label: "TRX" },
  { value: "BTC", label: "BTC" },
  { value: "ETH", label: "ETH" },
];

export const CRYPTO_REASON_OPTIONS: SelectOption[] = [
  { value: "", label: "All reasons" },
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "settlement", label: "Settlement" },
  { value: "refund", label: "Refund" },
];
