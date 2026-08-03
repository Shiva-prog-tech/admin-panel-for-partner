// ===========================================================================
// USD float — constants owned by this module.
//
// Filter options and status vocabularies belong with the screen that renders
// them. Only cross-cutting constants stay in types/constants.ts.
// ===========================================================================

import type { SelectOption } from "@/types/global";

export const JOURNAL_REASON_OPTIONS: SelectOption[] = [
  { value: "", label: "All reasons" },
  { value: "prefund", label: "Prefund" },
  { value: "crypto_settlement", label: "Crypto settlement" },
  { value: "card_topup", label: "Card top-up" },
  { value: "card_topup_refund", label: "Card top-up refund" },
  { value: "card_issuance", label: "Card issuance" },
];

/** Assets and chains offered by the custody → float converter. */
export const CONVERT_ASSETS = ["BTC", "ETH", "USDT", "USDC", "TRX", "MATIC"] as const;
export const CONVERT_CHAINS = ["eth", "tron", "polygon"] as const;
