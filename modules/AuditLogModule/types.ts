// ===========================================================================
// Audit log — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

/** One machine API request against the partner API. */
export interface ApiRequestLog {
  id: string;
  createdAt: string;
  method: HttpMethod;
  path: string;
  status: number;
  refId: string;
  latencyMs: number;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  createdAt: string;
}
