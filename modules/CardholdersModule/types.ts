// ===========================================================================
// Cardholders — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

export type CardholderStatus = "Approved" | "Rejected" | "Pending";

export interface Cardholder {
  id: string;
  refId: string;
  product: string;
  status: CardholderStatus;
  /** issuer rejection detail; may contain several " | " separated notes */
  reason: string | null;
  cards: number;
  wallets: number;
  deposited: number | null;
  createdAt: string;
}
