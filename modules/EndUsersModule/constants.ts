// ===========================================================================
// End users — constants owned by this module.
//
// Filter options and status vocabularies belong with the screen that renders
// them. Only cross-cutting constants stay in types/constants.ts.
// ===========================================================================

export const END_USER_STATUSES = [
  "Active",
  "Invited",
  "Suspended",
  "Closed",
] as const;
