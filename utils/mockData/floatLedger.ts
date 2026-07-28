// ===========================================================================
// USD float ledger — the entries behind the dashboard "View ledger" link
// ===========================================================================
import type { FloatEntry } from "@/types/global";
import { descendingStamps, hashSeed, pick, refIds, seededRandom } from "./seed";
import { floatSummary } from "./dashboard";

const TOTAL = 64;

const CREDITS = [
  "Wallet top-up settlement",
  "Crypto conversion — USDT/USD",
  "Partner funding transfer",
  "Card authorisation reversal",
  "Chargeback recovery",
] as const;

const DEBITS = [
  "Card authorisation capture",
  "Card issuing fee",
  "FX spread — USD/EUR",
  "Monthly platform fee",
  "Card order fulfilment",
] as const;

function build(): FloatEntry[] {
  const rand = seededRandom(hashSeed("float-ledger"));
  const ids = refIds("float-refs", TOTAL, 18);
  const stamps = descendingStamps("float-stamps", "2026-07-29T08:52:11", TOTAL, {
    minGap: 25,
    maxGap: 520,
  });

  let balance = floatSummary.amount;

  return Array.from({ length: TOTAL }, (_, i) => {
    const direction = rand() > 0.46 ? "credit" : "debit";
    const amount = Number((4 + rand() * 340).toFixed(2));
    const balanceAfter = Number(balance.toFixed(2));

    // Walking backwards through history: undo this entry for the next row.
    balance = direction === "credit" ? balance - amount : balance + amount;

    return {
      id: `fl-${i + 1}`,
      refId: ids[i],
      description: pick(direction === "credit" ? CREDITS : DEBITS, rand),
      direction,
      amount,
      balanceAfter,
      createdAt: stamps[i],
    } satisfies FloatEntry;
  });
}

export const floatEntries: FloatEntry[] = build();

export const floatStats = {
  balance: floatSummary.amount,
  creditsToday: Number(
    floatEntries
      .filter((e) => e.direction === "credit" && e.createdAt.startsWith("2026-07-29"))
      .reduce((acc, e) => acc + e.amount, 0)
      .toFixed(2)
  ),
  debitsToday: Number(
    floatEntries
      .filter((e) => e.direction === "debit" && e.createdAt.startsWith("2026-07-29"))
      .reduce((acc, e) => acc + e.amount, 0)
      .toFixed(2)
  ),
  entries: floatEntries.length,
};

export default floatEntries;
