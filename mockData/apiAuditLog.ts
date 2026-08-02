// ===========================================================================
// Machine API requests — every call your integration makes against the
// partner API, with the resolved status and server-side latency.
// ===========================================================================
import type { ApiRequestLog, HttpMethod } from "@/modules/AuditLogModule/types";
import { descendingStamps, hashSeed, pick, refIds, seededRandom, weighted } from "./seed";

const AUTHORED: Array<Omit<ApiRequestLog, "id">> = [
  { createdAt: "2026-07-28T21:55:12", method: "GET", path: "/api/v1/crypto/transactions?limit=100", status: 200, refId: "6a68d00a11e300cb9f57e1e3", latencyMs: 25 },
  { createdAt: "2026-07-28T21:47:19", method: "GET", path: "/api/v1/crypto/transactions?limit=100", status: 200, refId: "6a64e184d04790d52296ee67", latencyMs: 3 },
  { createdAt: "2026-07-28T21:47:02", method: "GET", path: "/api/v1/cardholders/status", status: 200, refId: "6a64e184d04790d52296ee67", latencyMs: 36 },
  { createdAt: "2026-07-28T21:46:59", method: "GET", path: "/api/v1/cardholders/status", status: 200, refId: "6a64e184d04790d52296ee67", latencyMs: 14 },
  { createdAt: "2026-07-28T21:46:58", method: "GET", path: "/api/v1/crypto/transactions?limit=100", status: 200, refId: "6a64e184d04790d52296ee67", latencyMs: 4 },
  { createdAt: "2026-07-28T21:46:58", method: "POST", path: "/api/v1/cardholders", status: 202, refId: "6a64e184d04790d52296ee67", latencyMs: 534 },
  { createdAt: "2026-07-28T21:46:46", method: "GET", path: "/api/v1/cardholders/status", status: 200, refId: "6a64e184d04790d52296ee67", latencyMs: 5 },
  { createdAt: "2026-07-28T21:46:44", method: "GET", path: "/api/v1/crypto/quote-usd?asset=USDT&amount=0", status: 400, refId: "6a64e184d04790d52296ee67", latencyMs: 0 },
  { createdAt: "2026-07-28T21:46:40", method: "GET", path: "/api/v1/crypto/quote-usd?asset=USDT&amount=0", status: 400, refId: "6a64e184d04790d52296ee67", latencyMs: 1 },
  { createdAt: "2026-07-28T21:46:38", method: "GET", path: "/api/v1/crypto/quote-usd?asset=USDT&amount=0", status: 400, refId: "6a64e184d04790d52296ee67", latencyMs: 1 },
  { createdAt: "2026-07-28T21:46:36", method: "GET", path: "/api/v1/crypto/transactions?limit=100", status: 200, refId: "6a64e184d04790d52296ee67", latencyMs: 4 },
  { createdAt: "2026-07-28T21:46:35", method: "GET", path: "/api/v1/crypto/balances/summary", status: 200, refId: "6a64e184d04790d52296ee67", latencyMs: 23 },
];

const TOTAL = 240;

const PATHS: Array<{ method: HttpMethod; path: string; statuses: number[]; weights: number[] }> = [
  { method: "GET", path: "/api/v1/crypto/transactions?limit=100", statuses: [200, 401], weights: [96, 4] },
  { method: "GET", path: "/api/v1/crypto/balances/summary", statuses: [200, 500], weights: [97, 3] },
  { method: "GET", path: "/api/v1/crypto/quote-usd?asset=USDT&amount=0", statuses: [400], weights: [100] },
  { method: "GET", path: "/api/v1/cardholders/status", statuses: [200, 401], weights: [94, 6] },
  { method: "POST", path: "/api/v1/cardholders", statuses: [202, 400], weights: [88, 12] },
  { method: "GET", path: "/api/v1/cards", statuses: [200], weights: [100] },
  { method: "POST", path: "/api/v1/cards/topup", statuses: [200, 400, 500], weights: [80, 15, 5] },
  { method: "GET", path: "/api/v1/cards/transactions?limit=50", statuses: [200], weights: [100] },
  { method: "POST", path: "/api/v1/crypto/settle", statuses: [200, 400], weights: [90, 10] },
  { method: "GET", path: "/api/v1/float/balance", statuses: [200], weights: [100] },
  { method: "PATCH", path: "/api/v1/cards/freeze", statuses: [200, 401], weights: [92, 8] },
  { method: "GET", path: "/api/v1/end-users?limit=100", statuses: [200], weights: [100] },
];

function build(): ApiRequestLog[] {
  const rand = seededRandom(hashSeed("api-audit-log"));
  const tailCount = TOTAL - AUTHORED.length;
  const refs = refIds("api-audit-refs", 14, 24);
  const stamps = descendingStamps(
    "api-audit-stamps",
    AUTHORED[AUTHORED.length - 1].createdAt,
    tailCount,
    { minGap: 1, maxGap: 90 }
  );

  const authored: ApiRequestLog[] = AUTHORED.map((row, i) => ({
    id: `ar-${i + 1}`,
    ...row,
  }));

  const tail: ApiRequestLog[] = Array.from({ length: tailCount }, (_, i) => {
    const route = pick(PATHS, rand);
    const status = weighted(route.statuses, route.weights, rand);
    // 4xx are rejected before any work happens, so they are effectively free.
    const latencyMs =
      status >= 400 && status < 500
        ? Math.floor(rand() * 3)
        : route.method === "POST"
          ? 120 + Math.floor(rand() * 620)
          : 1 + Math.floor(rand() * 60);

    return {
      id: `ar-${AUTHORED.length + i + 1}`,
      createdAt: stamps[i],
      method: route.method,
      path: route.path,
      status,
      refId: refs[Math.floor(rand() * refs.length)],
      latencyMs,
    } satisfies ApiRequestLog;
  });

  return [...authored, ...tail];
}

export const apiRequests: ApiRequestLog[] = build();

/** "2xx" | "400" | "401" | "500" → does this row belong in that bucket? */
export function matchesStatusBucket(status: number, bucket: string): boolean {
  if (!bucket) return true;
  if (bucket === "2xx") return status >= 200 && status < 300;
  if (bucket === "500") return status >= 500;
  return String(status) === bucket;
}

export const apiRequestStats = {
  total: apiRequests.length,
  ok: apiRequests.filter((r) => r.status >= 200 && r.status < 300).length,
  clientErrors: apiRequests.filter((r) => r.status >= 400 && r.status < 500).length,
  serverErrors: apiRequests.filter((r) => r.status >= 500).length,
  p95LatencyMs: (() => {
    const sorted = [...apiRequests].sort((a, b) => a.latencyMs - b.latencyMs);
    return sorted[Math.floor(sorted.length * 0.95)]?.latencyMs ?? 0;
  })(),
  calls24h: 3083,
};

export default apiRequests;
