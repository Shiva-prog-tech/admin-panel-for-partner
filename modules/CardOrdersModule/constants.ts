// ===========================================================================
// Physical card orders — constants owned by this module.
//
// Filter options and status vocabularies belong with the screen that renders
// them. Only cross-cutting constants stay in types/constants.ts.
// ===========================================================================

export const CARD_ORDER_STATUSES = ["Pending", "Shipped", "Delivered"] as const;
