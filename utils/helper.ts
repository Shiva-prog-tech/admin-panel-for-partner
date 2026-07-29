// ===========================================================================
// Pure helpers — class names, number/date formatting, deterministic series.
//
// Every formatter here is intentionally Intl-free: the same input must render
// byte-identically on the server and in the browser, otherwise React
// hydration mismatches show up in the tables.
// ===========================================================================

// --- class names ----------------------------------------------------------
export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | Record<string, boolean | null | undefined>;

export function cx(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const value of values) {
    if (!value) continue;
    if (typeof value === "string" || typeof value === "number") {
      out.push(String(value));
    } else {
      for (const [key, on] of Object.entries(value)) {
        if (on) out.push(key);
      }
    }
  }
  return out.join(" ");
}

// --- numbers --------------------------------------------------------------
/** 3084 → "3,084" */
export function formatNumber(value: number): string {
  const negative = value < 0;
  const [whole, fraction] = Math.abs(value).toString().split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}${grouped}${fraction ? `.${fraction}` : ""}`;
}

function toFixed(value: number, dp: number): string {
  return Math.abs(value).toFixed(dp);
}

/** 1924.34 → "$1924.34" (headline style — ungrouped, as per the spec) */
export function formatMoneyPlain(value: number, symbol = "$", dp = 2): string {
  return `${value < 0 ? "-" : ""}${symbol}${toFixed(value, dp)}`;
}

/** 1924.34 → "$1,924.34" (grouped — tooltips, tables, ledgers) */
export function formatMoney(value: number, symbol = "$", dp = 2): string {
  const fixed = toFixed(value, dp);
  const [whole, fraction] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${value < 0 ? "-" : ""}${symbol}${grouped}${fraction ? `.${fraction}` : ""}`;
}

/** 1200 → "$1.2K" — used for chart axis ticks */
export function formatCompactMoney(value: number, symbol = "$"): string {
  if (value === 0) return `${symbol}0`;
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) {
    return `${sign}${symbol}${trimZeros(abs / 1_000_000)}M`;
  }
  if (abs >= 1000) {
    return `${sign}${symbol}${trimZeros(abs / 1000)}K`;
  }
  return `${sign}${symbol}${Math.round(abs)}`;
}

function trimZeros(value: number): string {
  const s = value.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}

export function formatPercent(value: number, dp = 1): string {
  return `${value.toFixed(dp)}%`;
}

export function formatSigned(value: number, dp = 1): string {
  return `${value >= 0 ? "" : "-"}${Math.abs(value).toFixed(dp)}%`;
}

export function share(part: number, total: number, dp = 1): string {
  if (!total) return "0%";
  return `${((part / total) * 100).toFixed(dp)}%`;
}

// --- dates ----------------------------------------------------------------
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Stamp {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
}

/**
 * Parses "YYYY-MM-DDTHH:mm:ss" without touching the Date constructor, so the
 * rendered value never shifts with the host timezone.
 */
export function parseStamp(iso: string): Stamp {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(iso);
  if (!m) {
    return { year: 1970, month: 1, day: 1, hour: 0, minute: 0, second: 0 };
  }
  return {
    year: Number(m[1]),
    month: Number(m[2]),
    day: Number(m[3]),
    hour: Number(m[4] ?? "0"),
    minute: Number(m[5] ?? "0"),
    second: Number(m[6] ?? "0"),
  };
}

function clock(s: Stamp): string {
  const h24 = s.hour;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const mm = String(s.minute).padStart(2, "0");
  const ss = String(s.second).padStart(2, "0");
  return `${h12}:${mm}:${ss} ${suffix}`;
}

/** "2026-07-28T21:20:06" → "7/28/2026, 9:20:06 PM" */
export function formatDateTimeNumeric(iso: string): string {
  const s = parseStamp(iso);
  return `${s.month}/${s.day}/${s.year}, ${clock(s)}`;
}

/** "2025-05-28T21:26:09" → "May 28, 2025, 9:26:09 PM" */
export function formatDateTimeLong(iso: string): string {
  const s = parseStamp(iso);
  return `${MONTHS_SHORT[s.month - 1]} ${s.day}, ${s.year}, ${clock(s)}`;
}

/** "2025-05-28" → "May 28, 2025" */
export function formatDateLong(iso: string): string {
  const s = parseStamp(iso);
  return `${MONTHS_SHORT[s.month - 1]} ${s.day}, ${s.year}`;
}

/** "2025-05-23" → "May 23" */
export function formatDateShort(iso: string): string {
  const s = parseStamp(iso);
  return `${MONTHS_SHORT[s.month - 1]} ${s.day}`;
}

export function formatMonthName(month: number): string {
  return MONTHS_LONG[(month - 1 + 12) % 12];
}

/** "2025-05-22" + "2025-05-29" → "May 22, 2025 - May 29, 2025" */
export function formatRange(from: string, to: string): string {
  return `${formatDateLong(from)} - ${formatDateLong(to)}`;
}

/** Human "3 hours ago" style label, computed against a supplied reference. */
export function relativeFrom(iso: string, referenceIso: string): string {
  const a = stampToMinutes(parseStamp(iso));
  const b = stampToMinutes(parseStamp(referenceIso));
  const diff = Math.max(0, b - a);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff} min ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

function stampToMinutes(s: Stamp): number {
  // Rough day count is sufficient for relative labels and stays deterministic.
  const days = s.year * 365 + s.month * 30 + s.day;
  return days * 24 * 60 + s.hour * 60 + s.minute;
}

/** Subtracts whole days from an ISO date, staying inside plain arithmetic. */
export function shiftIsoDate(iso: string, deltaDays: number): string {
  const s = parseStamp(iso);
  const utc = Date.UTC(s.year, s.month - 1, s.day) + deltaDays * 86_400_000;
  const d = new Date(utc);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${d.getUTCFullYear()}-${mm}-${dd}`;
}

// --- strings --------------------------------------------------------------
export function truncateMiddle(value: string, head = 10, tail = 8): string {
  if (value.length <= head + tail + 1) return value;
  // `slice(-0)` returns the whole string, so a zero tail must short-circuit.
  if (tail <= 0) return `${value.slice(0, head)}…`;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function titleCase(value: string): string {
  return value.replace(/(^|\s|-)([a-z])/g, (_, pre, ch) => pre + ch.toUpperCase());
}

// --- deterministic randomness --------------------------------------------
/** mulberry32 — small, fast, fully reproducible PRNG. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Jagged micro-series used by the dashboard stat tiles. */
export function jaggedSeries(seed: string, count = 34, base = 50, jitter = 26): number[] {
  const rand = seededRandom(hashSeed(seed));
  const out: number[] = [];
  let level = base;
  for (let i = 0; i < count; i += 1) {
    const drift = (rand() - 0.44) * jitter * 0.5;
    const spike = rand() > 0.86 ? (rand() - 0.5) * jitter : 0;
    level = Math.max(6, Math.min(100, level + drift + spike));
    out.push(Number(level.toFixed(2)));
  }
  return out;
}

/** Smooth S-curve series used by the listing-page stat tiles. */
export function smoothSeries(seed: string, count = 26): number[] {
  const rand = seededRandom(hashSeed(seed));
  const phase = rand() * Math.PI;
  const amp = 18 + rand() * 10;
  const out: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const growth = 22 + t * 52;
    const wave = Math.sin(phase + t * Math.PI * 1.7) * amp * (0.45 + t * 0.55);
    out.push(Number(Math.max(4, growth + wave * 0.5).toFixed(2)));
  }
  return out;
}

export function pick<T>(items: readonly T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length) % items.length];
}

/** 22-char lowercase hex reference id, e.g. "6a690b01c39bc0d473e1e3". */
export function makeRefId(rand: () => number, length = 22): string {
  const alphabet = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(rand() * 16) % 16];
  }
  return out;
}

// --- collections ----------------------------------------------------------
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function range(count: number): number[] {
  return Array.from({ length: count }, (_, i) => i);
}

export function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

export function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function sortBy<T>(
  rows: T[],
  value: (row: T) => string | number | null | undefined,
  dir: "asc" | "desc" = "asc"
): T[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = value(a);
    const vb = value(b);
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === "number" && typeof vb === "number") {
      return (va - vb) * factor;
    }
    return String(va).localeCompare(String(vb), "en") * factor;
  });
}

/** Windowed page list with ellipsis gaps, e.g. [1,2,3,"…",11]. */
export function pageWindow(
  current: number,
  total: number,
  span = 1
): Array<number | "gap"> {
  if (total <= 1) return [1];
  const pages = new Set<number>([1, total, current]);
  for (let i = 1; i <= span; i += 1) {
    if (current - i > 1) pages.add(current - i);
    if (current + i < total) pages.add(current + i);
  }
  if (current <= 2) {
    pages.add(2);
    pages.add(3);
  }
  if (current >= total - 1) {
    pages.add(total - 1);
    pages.add(total - 2);
  }
  const ordered = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out: Array<number | "gap"> = [];
  let prev = 0;
  for (const page of ordered) {
    if (prev && page - prev > 1) out.push("gap");
    out.push(page);
    prev = page;
  }
  return out;
}
