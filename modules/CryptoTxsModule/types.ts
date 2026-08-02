// ===========================================================================
// Crypto transactions — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

import type { LedgerDirection } from "@/types/global";

export type CryptoReason = "deposit" | "withdrawal" | "settlement" | "refund";

export interface CryptoTx {
  id: string;
  createdAt: string;
  /** end-user ref, or "_pool" for tenant pool movements */
  refId: string;
  dir: LedgerDirection;
  asset: string;
  chain: string;
  /** raw units as reported by custody, e.g. "47.19999973" */
  amount: string;
  reason: CryptoReason;
  txHash: string | null;
}
