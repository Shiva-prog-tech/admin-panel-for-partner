// ===========================================================================
// Cards dataset — 35 issued cards
// ===========================================================================
import type { Card, CardStatus } from "@/types/global";
import { smoothSeries } from "@/utils/helper";
import { cardholders } from "./cardholders";
import { descendingStamps, hashSeed, pick, refIds, seededRandom, weighted } from "./seed";

const TOTAL = 35;

const STATUSES: CardStatus[] = ["Active", "Frozen", "Terminated", "Pending"];
const STATUS_WEIGHTS = [70, 12, 8, 10];

function build(): Card[] {
  const rand = seededRandom(hashSeed("cards"));
  const ids = refIds("cards-refs", TOTAL, 20);
  const stamps = descendingStamps("cards-stamps", "2026-07-28T20:44:12", TOTAL, {
    minGap: 180,
    maxGap: 2600,
  });

  return Array.from({ length: TOTAL }, (_, i) => {
    const status = weighted(STATUSES, STATUS_WEIGHTS, rand);
    const balance = status === "Active" ? Number((rand() * 1400).toFixed(2)) : 0;

    return {
      id: `cd-${i + 1}`,
      refId: ids[i],
      last4: String(1000 + Math.floor(rand() * 8999)).slice(-4),
      scheme: rand() > 0.35 ? "Visa" : "Mastercard",
      type: rand() > 0.28 ? "Virtual" : "Physical",
      cardholderRef: cardholders[Math.floor(rand() * cardholders.length)].refId,
      balance,
      spend30d: Number((rand() * 2600).toFixed(2)),
      status,
      createdAt: stamps[i],
    } satisfies Card;
  });
}

export const cards: Card[] = build();

export const cardStats = {
  total: 35,
  active: cards.filter((c) => c.status === "Active").length,
  frozen: cards.filter((c) => c.status === "Frozen").length,
  physical: cards.filter((c) => c.type === "Physical").length,
  series: {
    total: smoothSeries("cards-total", 26),
    active: smoothSeries("cards-active", 26),
    frozen: smoothSeries("cards-frozen", 26),
    physical: smoothSeries("cards-physical", 26),
  },
};

export default cards;
