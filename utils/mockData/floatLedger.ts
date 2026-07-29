// ===========================================================================
// USD float journal — prefunded balance used for card issuance and top-ups.
//
// Crypto settlements arrive as a credit immediately followed by the card
// top-up debit, so the pairs below intentionally share a timestamp.
// ===========================================================================
import type { JournalEntry, JournalReason, LedgerDirection } from "@/types/global";
import { floatSummary } from "./dashboard";
import { descendingStamps, hashSeed, pick, seededRandom, weighted } from "./seed";

const AUTHORED: Array<Omit<JournalEntry, "id">> = [
  { createdAt: "2026-07-28T20:36:23", direction: "debit", amount: 303, reason: "card_topup", reference: null },
  { createdAt: "2026-07-28T20:36:23", direction: "credit", amount: 303, reason: "crypto_settlement", reference: "crypto settlement 303 USDT to float" },
  { createdAt: "2026-07-28T19:47:39", direction: "debit", amount: 505, reason: "card_topup", reference: null },
  { createdAt: "2026-07-28T18:46:36", direction: "debit", amount: 47.2, reason: "card_topup", reference: null },
  { createdAt: "2026-07-28T18:46:36", direction: "credit", amount: 47.2, reason: "crypto_settlement", reference: "crypto settlement 47.19999973 USDT to float" },
  { createdAt: "2026-07-28T18:24:35", direction: "debit", amount: 51.55, reason: "card_topup", reference: null },
  { createdAt: "2026-07-28T18:24:35", direction: "credit", amount: 51.55, reason: "crypto_settlement", reference: "crypto settlement 158.62155646 TRX to float" },
  { createdAt: "2026-07-28T12:49:03", direction: "debit", amount: 808, reason: "card_topup", reference: null },
  { createdAt: "2026-07-28T12:42:55", direction: "credit", amount: 808, reason: "card_topup_refund", reference: "Card top-up failed: wasabi API error (code 40021): Insufficient balance" },
  { createdAt: "2026-07-28T12:42:55", direction: "debit", amount: 808, reason: "card_topup", reference: null },
  { createdAt: "2026-07-28T12:42:51", direction: "credit", amount: 808, reason: "card_topup_refund", reference: "Card top-up failed: wasabi API error (code 40021): Insufficient balance" },
  { createdAt: "2026-07-28T12:42:50", direction: "debit", amount: 808, reason: "card_topup", reference: null },
];

const TOTAL = 96;

const REASONS: JournalReason[] = [
  "prefund",
  "crypto_settlement",
  "card_topup",
  "card_topup_refund",
  "card_issuance",
];
const REASON_WEIGHTS = [6, 30, 44, 8, 12];

const SETTLE_ASSETS = ["USDT", "USDC", "TRX"] as const;

/** Credits fund the float; debits spend it. */
function directionFor(reason: JournalReason): LedgerDirection {
  return reason === "prefund" ||
    reason === "crypto_settlement" ||
    reason === "card_topup_refund"
    ? "credit"
    : "debit";
}

function referenceFor(
  reason: JournalReason,
  amount: number,
  rand: () => number
): string | null {
  if (reason === "crypto_settlement") {
    return `crypto settlement ${amount} ${pick(SETTLE_ASSETS, rand)} to float`;
  }
  if (reason === "card_topup_refund") {
    return "Card top-up failed: wasabi API error (code 40021): Insufficient balance";
  }
  if (reason === "prefund") {
    return "Partner wire received — reference SWP-PREFUND";
  }
  return null;
}

function build(): JournalEntry[] {
  const rand = seededRandom(hashSeed("float-journal"));
  const tailCount = TOTAL - AUTHORED.length;
  const stamps = descendingStamps(
    "journal-stamps",
    AUTHORED[AUTHORED.length - 1].createdAt,
    tailCount,
    { minGap: 8, maxGap: 420 }
  );

  const authored: JournalEntry[] = AUTHORED.map((row, i) => ({
    id: `je-${i + 1}`,
    ...row,
  }));

  const tail: JournalEntry[] = Array.from({ length: tailCount }, (_, i) => {
    const reason = weighted(REASONS, REASON_WEIGHTS, rand);
    const amount = Number((4 + rand() * 900).toFixed(2));

    return {
      id: `je-${AUTHORED.length + i + 1}`,
      createdAt: stamps[i],
      direction: directionFor(reason),
      amount,
      reason,
      reference: referenceFor(reason, amount, rand),
    } satisfies JournalEntry;
  });

  return [...authored, ...tail];
}

export const journalEntries: JournalEntry[] = build();

export const floatStats = {
  balance: floatSummary.amount,
  status: floatSummary.status,
  creditsToday: Number(
    journalEntries
      .filter((e) => e.direction === "credit" && e.createdAt.startsWith("2026-07-28"))
      .reduce((acc, e) => acc + e.amount, 0)
      .toFixed(2)
  ),
  debitsToday: Number(
    journalEntries
      .filter((e) => e.direction === "debit" && e.createdAt.startsWith("2026-07-28"))
      .reduce((acc, e) => acc + e.amount, 0)
      .toFixed(2)
  ),
  entries: journalEntries.length,
};

export default journalEntries;
