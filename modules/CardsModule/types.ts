// ===========================================================================
// Cards — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

export type CardStatus = "Normal" | "Pending" | "Frozen" | "Success";

export interface Card {
  id: string;
  refId: string;
  /** masked PAN, e.g. "•••• •••• •••• 0300"; null before personalisation */
  cardNumberMasked: string | null;
  /** issuer card reference (long WD… number) */
  cardNo: string;
  last4: string | null;
  balance: number | null;
  currency: string;
  product: string;
  status: CardStatus;
  createdAt: string;
}
