// ===========================================================================
// End users — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

export type EndUserStatus = "Active" | "Invited" | "Suspended" | "Closed";

export interface EndUser {
  id: string;
  refId: string;
  cards: number;
  cardholders: number;
  cardTxs: number;
  walletTxs: number;
  deposited: number | null;
  createdAt: string;
  status: EndUserStatus;
}
