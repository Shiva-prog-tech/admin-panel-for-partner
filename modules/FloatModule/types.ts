// ===========================================================================
// USD float — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

import type { LedgerDirection } from "@/types/global";

export type JournalReason =
  | "prefund"
  | "crypto_settlement"
  | "card_topup"
  | "card_topup_refund"
  | "card_issuance";

export interface JournalEntry {
  id: string;
  createdAt: string;
  direction: LedgerDirection;
  /** always USD on the float ledger */
  amount: number;
  reason: JournalReason;
  reference: string | null;
}

export interface ConvertQuote {
  asset: string;
  chain: string;
  amount: number;
  rate: number;
  usd: number;
  feeUsd: number;
  netUsd: number;
}
