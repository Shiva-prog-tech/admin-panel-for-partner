// ===========================================================================
// Cardholders — constants owned by this module.
//
// Filter options and status vocabularies belong with the screen that renders
// them. Only cross-cutting constants stay in types/constants.ts.
// ===========================================================================

export const CARDHOLDER_STATUSES = ["Approved", "Pending", "Rejected"] as const;

export const REJECTION_REASONS = [
  "An issue was detected with the document and verification could not be completed",
  "The applicant uploaded screenshots instead of photos or scans.  |  [PASSPORT] The applicant uploaded screenshots instead of photos",
  "The type of residence permit is not supported.",
  "The document has expired.",
  "[SELFIE] The selfie does not match the submitted document.",
] as const;
