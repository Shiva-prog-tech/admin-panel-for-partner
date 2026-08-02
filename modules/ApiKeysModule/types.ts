// ===========================================================================
// API keys — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

import type { Environment } from "@/types/global";

export type ApiKeyState = "Active" | "Revoked";

export interface ApiKey {
  id: string;
  /** visible key prefix, e.g. "fsk_live_4f054af" */
  prefix: string;
  label: string;
  state: ApiKeyState;
  lastUsed: string | null;
  scope: "read" | "read_write";
  environment: Environment;
  createdAt: string;
}
