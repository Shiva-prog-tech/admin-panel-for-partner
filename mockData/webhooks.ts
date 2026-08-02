// ===========================================================================
// Webhook endpoints dataset
// ===========================================================================
import type { WebhookEndpoint, WebhookState } from "@/modules/WebhooksModule/types";
import { smoothSeries } from "@/utils/helper";
import { descendingStamps } from "./seed";

const ENDPOINTS: Array<{
  url: string;
  events: string[];
  successRate: number;
  state: WebhookState;
  lastDelivery: string;
}> = [
  {
    url: "https://api.travls.io/hooks/swipeo/cards",
    events: ["card.created", "card.frozen", "card.terminated"],
    successRate: 100,
    state: "Healthy",
    lastDelivery: "2026-07-29T09:48:12",
  },
  {
    url: "https://api.travls.io/hooks/swipeo/transactions",
    events: ["transaction.authorised", "transaction.settled", "transaction.declined"],
    successRate: 99.8,
    state: "Healthy",
    lastDelivery: "2026-07-29T09:51:40",
  },
  {
    url: "https://api.travls.io/hooks/swipeo/kyc",
    events: ["cardholder.approved", "cardholder.rejected"],
    successRate: 100,
    state: "Healthy",
    lastDelivery: "2026-07-29T08:12:03",
  },
  {
    url: "https://api.travls.io/hooks/swipeo/custody",
    events: ["custody.deposit", "custody.withdrawal"],
    successRate: 97.4,
    state: "Degraded",
    lastDelivery: "2026-07-29T07:30:55",
  },
  {
    url: "https://ops.travls.io/hooks/float",
    events: ["float.credited", "float.debited"],
    successRate: 100,
    state: "Healthy",
    lastDelivery: "2026-07-29T09:20:18",
  },
  {
    url: "https://staging.travls.io/hooks/swipeo/all",
    events: ["*"],
    successRate: 0,
    state: "Paused",
    lastDelivery: "2026-06-14T11:02:47",
  },
];

function build(): WebhookEndpoint[] {
  const stamps = descendingStamps("webhook-stamps", "2026-05-02T10:00:00", ENDPOINTS.length, {
    minGap: 4_000,
    maxGap: 42_000,
  });

  return ENDPOINTS.map((endpoint, i) => ({
    id: `wh-${i + 1}`,
    ...endpoint,
    createdAt: stamps[i],
  }));
}

export const webhookEndpoints: WebhookEndpoint[] = build();

export const webhookStats = {
  endpoints: webhookEndpoints.length,
  healthy: webhookEndpoints.filter((w) => w.state === "Healthy").length,
  issues7d: 0,
  deliveries24h: 4128,
  series: {
    endpoints: smoothSeries("wh-endpoints", 26),
    healthy: smoothSeries("wh-healthy", 26),
    issues: smoothSeries("wh-issues", 26),
    deliveries: smoothSeries("wh-deliveries", 26),
  },
};

export default webhookEndpoints;
