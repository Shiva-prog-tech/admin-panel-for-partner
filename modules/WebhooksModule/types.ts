// ===========================================================================
// Webhooks — types owned by this module.
//
// Co-located per the reference's Components/FilmoraPopup/types.ts convention.
// Only genuinely cross-cutting types stay in types/global.ts.
// ===========================================================================

export type DeliveryStatus = "Delivered" | "Failed" | "Pending";

export interface WebhookConfig {
  url: string;
  secretHint: string;
  rotatedAt: string;
}

export interface WebhookDelivery {
  id: string;
  createdAt: string;
  event: string;
  refId: string;
  status: DeliveryStatus;
  attempts: number;
  error: string | null;
}

export type WebhookState = "Healthy" | "Degraded" | "Failing" | "Paused";

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  successRate: number;
  lastDelivery: string;
  state: WebhookState;
  createdAt: string;
}
