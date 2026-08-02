// ===========================================================================
// Webhook configuration + delivery log
// ===========================================================================
import type { DeliveryStatus, WebhookConfig, WebhookDelivery } from "@/modules/WebhooksModule/types";
import { descendingStamps, hashSeed, pick, refIds, seededRandom, weighted } from "./seed";

export const webhookConfig: WebhookConfig = {
  url: "https://card-service.travls.io/v1/webhooks/swipeo",
  secretHint: "whsec_••••••••••••4f7a",
  rotatedAt: "2026-05-02T10:00:00",
};

const AUTHORED: Array<Omit<WebhookDelivery, "id">> = [
  { createdAt: "2026-07-28T21:48:21", event: "cardholder.updated", refId: "6a64e184d04790d52296ee67", status: "Delivered", attempts: 1, error: null },
  { createdAt: "2026-07-28T21:46:58", event: "cardholder.updated", refId: "6a64e184d04790d52296ee67", status: "Delivered", attempts: 1, error: null },
  { createdAt: "2026-07-28T21:33:03", event: "card.auth_transaction", refId: "6a4b90b66852a9e227b979e2", status: "Delivered", attempts: 1, error: null },
  { createdAt: "2026-07-28T21:18:03", event: "card.auth_transaction", refId: "6a4b90b66852a9e227b979e2", status: "Delivered", attempts: 1, error: null },
  { createdAt: "2026-07-28T21:13:30", event: "card.auth_transaction", refId: "6a4b90b66852a9e227b979e2", status: "Delivered", attempts: 1, error: null },
];

const TOTAL = 120;

const EVENTS = [
  "cardholder.updated",
  "cardholder.approved",
  "cardholder.rejected",
  "card.auth_transaction",
  "card.created",
  "card.frozen",
  "card.topup_completed",
  "card.topup_failed",
  "crypto.deposit_confirmed",
  "crypto.settlement_completed",
  "float.credited",
  "float.debited",
] as const;

const STATUSES: DeliveryStatus[] = ["Delivered", "Failed", "Pending"];
const STATUS_WEIGHTS = [90, 6, 4];

const ERRORS = [
  "504 Gateway Timeout after 10000ms",
  "Connection reset by peer",
  "500 Internal Server Error",
  "Signature verification failed on receiver",
] as const;

function build(): WebhookDelivery[] {
  const rand = seededRandom(hashSeed("webhook-deliveries"));
  const tailCount = TOTAL - AUTHORED.length;
  const refs = refIds("delivery-refs", 16, 24);
  const stamps = descendingStamps(
    "delivery-stamps",
    AUTHORED[AUTHORED.length - 1].createdAt,
    tailCount,
    { minGap: 3, maxGap: 180 }
  );

  const authored: WebhookDelivery[] = AUTHORED.map((row, i) => ({
    id: `wd-${i + 1}`,
    ...row,
  }));

  const tail: WebhookDelivery[] = Array.from({ length: tailCount }, (_, i) => {
    const status = weighted(STATUSES, STATUS_WEIGHTS, rand);
    return {
      id: `wd-${AUTHORED.length + i + 1}`,
      createdAt: stamps[i],
      event: pick(EVENTS, rand),
      refId: refs[Math.floor(rand() * refs.length)],
      status,
      attempts: status === "Delivered" ? 1 : status === "Pending" ? 0 : 2 + Math.floor(rand() * 4),
      error: status === "Failed" ? pick(ERRORS, rand) : null,
    } satisfies WebhookDelivery;
  });

  return [...authored, ...tail];
}

export const webhookDeliveries: WebhookDelivery[] = build();

export const deliveryStats = {
  total: webhookDeliveries.length,
  delivered: webhookDeliveries.filter((d) => d.status === "Delivered").length,
  failed: webhookDeliveries.filter((d) => d.status === "Failed").length,
  pending: webhookDeliveries.filter((d) => d.status === "Pending").length,
};

export default webhookDeliveries;
