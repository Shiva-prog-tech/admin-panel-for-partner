// ===========================================================================
// Physical card orders — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

export type CardOrderStatus = "Pending" | "Shipped" | "Delivered";

export interface CardOrder {
  id: string;
  /** human order number */
  order: string;
  refId: string;
  status: CardOrderStatus;
  recipient: string;
  country: string;
  tracking: string | null;
  createdAt: string;
}
