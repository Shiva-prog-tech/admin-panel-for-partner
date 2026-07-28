// ===========================================================================
// Deterministic dataset helpers.
//
// Every generator is seeded, so the panel renders byte-identical markup on the
// server and the client (no hydration warnings) and screenshots stay stable.
// ===========================================================================
import { makeRefId, pick, seededRandom, hashSeed } from "@/utils/helper";

/** Formats a UTC millisecond value back into "YYYY-MM-DDTHH:mm:ss". */
export function toIso(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  );
}

/** Parses "YYYY-MM-DDTHH:mm:ss" as UTC milliseconds. */
export function fromIso(iso: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})$/.exec(iso);
  if (!m) return Date.UTC(2026, 0, 1);
  return Date.UTC(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
    Number(m[4]),
    Number(m[5]),
    Number(m[6])
  );
}

export function minusMinutes(iso: string, minutes: number): string {
  return toIso(fromIso(iso) - minutes * 60_000);
}

/**
 * Builds a descending list of timestamps starting just before `startIso`,
 * with organic-looking gaps between records.
 */
export function descendingStamps(
  seed: string,
  startIso: string,
  count: number,
  { minGap = 26, maxGap = 640 } = {}
): string[] {
  const rand = seededRandom(hashSeed(seed));
  const out: string[] = [];
  let cursor = fromIso(startIso);

  for (let i = 0; i < count; i += 1) {
    const gap = Math.floor(minGap + rand() * (maxGap - minGap));
    cursor -= gap * 60_000;
    out.push(toIso(cursor));
  }

  return out;
}

/** Weighted pick — `weights` must be the same length as `items`. */
export function weighted<T>(
  items: readonly T[],
  weights: readonly number[],
  rand: () => number
): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rand() * total;
  for (let i = 0; i < items.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function refIds(seed: string, count: number, length = 22): string[] {
  const rand = seededRandom(hashSeed(seed));
  return Array.from({ length: count }, () => makeRefId(rand, length));
}

export { pick, seededRandom, hashSeed };
