// ===========================================================================
// API keys dataset
// ===========================================================================
import type { ApiKey } from "@/types/global";

export const apiKeys: ApiKey[] = [
  {
    id: "ak-1",
    label: "Production server",
    prefix: "sk_live_9f2c",
    scope: "read_write",
    environment: "live",
    lastUsed: "2026-07-29T09:52:36",
    state: "Active",
    createdAt: "2025-11-04T13:22:10",
  },
  {
    id: "ak-2",
    label: "Booking service",
    prefix: "sk_live_41ba",
    scope: "read_write",
    environment: "live",
    lastUsed: "2026-07-29T09:44:02",
    state: "Active",
    createdAt: "2026-01-18T09:05:47",
  },
  {
    id: "ak-3",
    label: "Reporting worker",
    prefix: "sk_live_7d10",
    scope: "read",
    environment: "live",
    lastUsed: "2026-07-29T06:00:12",
    state: "Active",
    createdAt: "2026-02-27T16:41:29",
  },
  {
    id: "ak-4",
    label: "Sandbox playground",
    prefix: "sk_test_2ee8",
    scope: "read_write",
    environment: "sandbox",
    lastUsed: "2026-07-24T18:31:55",
    state: "Active",
    createdAt: "2026-03-12T11:19:03",
  },
  {
    id: "ak-5",
    label: "Legacy integration",
    prefix: "sk_live_0a5f",
    scope: "read",
    environment: "live",
    lastUsed: "2026-04-02T22:07:41",
    state: "Revoked",
    createdAt: "2025-08-21T08:54:36",
  },
];

export const apiKeyStats = {
  total: apiKeys.length,
  active: apiKeys.filter((k) => k.state === "Active").length,
  live: apiKeys.filter((k) => k.environment === "live").length,
  calls24h: 3084,
};

export default apiKeys;
