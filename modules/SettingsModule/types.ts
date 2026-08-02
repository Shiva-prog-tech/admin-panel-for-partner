// ===========================================================================
// Settings — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

/** Settings → Profile card */
export interface ProfileInfo {
  name: string;
  email: string;
  role: string;
  environment: string;
}

/** Settings → Organization card */
export interface OrganizationInfo {
  tenant: string;
  slug: string;
  rateLimit: string;
  webhookUrl: string;
}
