// ===========================================================================
// Audit log dataset
// ===========================================================================
import type { AuditEvent } from "@/modules/AuditLogModule/types";
import { descendingStamps, hashSeed, pick, seededRandom } from "./seed";
import { endUsers } from "./endUsers";
import { cardholders } from "./cardholders";

const TOTAL = 120;

const ACTORS = [
  "john.doe@travls.io",
  "ops.bot@travls.io",
  "amelia.k@travls.io",
  "service@travls.io",
] as const;

const ACTIONS = [
  { action: "cardholder.approved", target: "cardholder" },
  { action: "cardholder.rejected", target: "cardholder" },
  { action: "end_user.suspended", target: "end_user" },
  { action: "end_user.invited", target: "end_user" },
  { action: "card.frozen", target: "card" },
  { action: "card.issued", target: "card" },
  { action: "api_key.created", target: "api_key" },
  { action: "api_key.revoked", target: "api_key" },
  { action: "webhook.updated", target: "webhook" },
  { action: "float.topped_up", target: "float" },
  { action: "settings.updated", target: "settings" },
  { action: "export.requested", target: "end_user" },
] as const;

const IPS = [
  "185.62.14.9",
  "51.15.201.77",
  "94.201.33.180",
  "20.79.114.6",
  "172.58.20.144",
] as const;

function build(): AuditEvent[] {
  const rand = seededRandom(hashSeed("audit-log"));
  const stamps = descendingStamps("audit-stamps", "2026-07-29T09:58:44", TOTAL, {
    minGap: 8,
    maxGap: 340,
  });

  return Array.from({ length: TOTAL }, (_, i) => {
    const entry = pick(ACTIONS, rand);
    const ref =
      entry.target === "cardholder"
        ? cardholders[Math.floor(rand() * cardholders.length)].refId
        : entry.target === "end_user"
          ? endUsers[Math.floor(rand() * endUsers.length)].refId
          : entry.target;

    return {
      id: `au-${i + 1}`,
      actor: pick(ACTORS, rand),
      action: entry.action,
      target: ref,
      ip: pick(IPS, rand),
      createdAt: stamps[i],
    } satisfies AuditEvent;
  });
}

export const auditEvents: AuditEvent[] = build();

export const auditStats = {
  total: auditEvents.length,
  today: auditEvents.filter((e) => e.createdAt.startsWith("2026-07-29")).length,
  actors: new Set(auditEvents.map((e) => e.actor)).size,
  adminActions: auditEvents.filter((e) => e.actor !== "ops.bot@travls.io").length,
};

export default auditEvents;
