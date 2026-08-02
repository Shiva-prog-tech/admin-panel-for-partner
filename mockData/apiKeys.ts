// ===========================================================================
// API keys dataset
// ===========================================================================
import type { ApiKey } from "@/modules/ApiKeysModule/types";

export const apiKeys: ApiKey[] = [
  {
    id: "ak-1",
    prefix: "fsk_live_4f054af",
    label: "Live",
    state: "Active",
    lastUsed: "2026-07-28T21:55:12",
    scope: "read_write",
    environment: "live",
    createdAt: "2025-11-04T13:22:10",
  },
  {
    id: "ak-2",
    prefix: "fsk_live_9b21c74",
    label: "Booking service",
    state: "Active",
    lastUsed: "2026-07-29T09:44:02",
    scope: "read_write",
    environment: "live",
    createdAt: "2026-01-18T09:05:47",
  },
  {
    id: "ak-3",
    prefix: "fsk_live_7d10ea3",
    label: "Reporting worker",
    state: "Active",
    lastUsed: "2026-07-29T06:00:12",
    scope: "read",
    environment: "live",
    createdAt: "2026-02-27T16:41:29",
  },
  {
    id: "ak-4",
    prefix: "fsk_test_2ee8b50",
    label: "Sandbox playground",
    state: "Active",
    lastUsed: "2026-07-24T18:31:55",
    scope: "read_write",
    environment: "sandbox",
    createdAt: "2026-03-12T11:19:03",
  },
  {
    id: "ak-5",
    prefix: "fsk_live_0a5f18d",
    label: "Legacy integration",
    state: "Revoked",
    lastUsed: "2026-04-02T22:07:41",
    scope: "read",
    environment: "live",
    createdAt: "2025-08-21T08:54:36",
  },
];

export const apiKeyStats = {
  total: apiKeys.length,
  active: apiKeys.filter((k) => k.state === "Active").length,
  live: apiKeys.filter((k) => k.environment === "live").length,
  calls24h: 3083,
};

export default apiKeys;
