// ===========================================================================
// Cards dataset — issuer card records
//
// Mirrors the issuer payload: a long "card no" reference is always present,
// while the masked PAN and last-4 only exist once the card is personalised.
// ===========================================================================
import type { Card, CardStatus } from "@/types/global";
import { smoothSeries } from "@/utils/helper";
import { CARD_PRODUCTS } from "@/types/constants";
import { descendingStamps, hashSeed, pick, refIds, seededRandom, weighted } from "./seed";

const TOTAL = 35;

const STATUSES: CardStatus[] = ["Normal", "Pending", "Frozen", "Success"];
const STATUS_WEIGHTS = [70, 12, 10, 8];

/** Issuer references look like WD + yyyymmdd + a 20-digit sequence. */
function cardNo(rand: () => number, createdAt: string): string {
  const day = createdAt.slice(0, 10).replace(/-/g, "");
  let digits = "";
  for (let i = 0; i < 20; i += 1) digits += Math.floor(rand() * 10);
  return `WD${day}${digits}`;
}

const FIRST_PAGE: Array<Partial<Card> & { refId: string }> = [
  {
    refId: "6a4ba6016852a9e227b97a21",
    cardNumberMasked: "•••• •••• •••• 0300",
    last4: "0300",
    balance: 1697.34,
    status: "Normal",
    createdAt: "2026-07-26T20:11:04",
  },
  {
    refId: "6a493e0f6852a9e227b978f7",
    cardNumberMasked: null,
    last4: null,
    balance: 0,
    status: "Normal",
    createdAt: "2026-07-26T16:51:38",
  },
  {
    refId: "6a4b90b66852a9e227b979e2",
    cardNumberMasked: "•••• •••• •••• 3205",
    last4: "3205",
    balance: 734.92,
    status: "Normal",
    createdAt: "2026-07-24T20:27:16",
  },
  {
    refId: "6a635ddad04790d52296ebc2",
    cardNumberMasked: null,
    last4: null,
    balance: 22.05,
    status: "Normal",
    createdAt: "2026-07-24T19:04:15",
  },
  {
    refId: "6a61fce4d04790d52296e9ea",
    cardNumberMasked: "•••• •••• •••• 3304",
    last4: "3304",
    balance: 0.01,
    status: "Normal",
    createdAt: "2026-07-23T20:22:18",
  },
  {
    refId: "6a61fd04d04790d52296e9ee",
    cardNumberMasked: null,
    last4: null,
    balance: 291.8,
    status: "Normal",
    createdAt: "2026-07-23T19:59:40",
  },
  {
    refId: "6a61fde8d04790d52296ea0a",
    cardNumberMasked: null,
    last4: null,
    balance: 10,
    status: "Normal",
    createdAt: "2026-07-23T19:57:22",
  },
  {
    refId: "6a61ff15d04790d52296ea2a",
    cardNumberMasked: null,
    last4: null,
    balance: null,
    status: "Success",
    createdAt: "2026-07-23T19:44:45",
  },
  {
    refId: "6a61347cd04790d52296e98d",
    cardNumberMasked: null,
    last4: null,
    balance: 0,
    status: "Normal",
    createdAt: "2026-07-23T13:08:19",
  },
];

function build(): Card[] {
  const rand = seededRandom(hashSeed("cards-v2"));
  const tailCount = TOTAL - FIRST_PAGE.length;
  const ids = refIds("cards-refs-v2", tailCount, 24);
  const stamps = descendingStamps(
    "cards-stamps-v2",
    FIRST_PAGE[FIRST_PAGE.length - 1].createdAt as string,
    tailCount,
    { minGap: 180, maxGap: 2600 }
  );

  const authored: Card[] = FIRST_PAGE.map((row, i) => ({
    id: `cd-${i + 1}`,
    refId: row.refId,
    cardNumberMasked: row.cardNumberMasked ?? null,
    cardNo: cardNo(rand, row.createdAt as string),
    last4: row.last4 ?? null,
    balance: row.balance ?? null,
    currency: "USD",
    product: "prod_111059",
    status: row.status as CardStatus,
    createdAt: row.createdAt as string,
  }));

  const tail: Card[] = Array.from({ length: tailCount }, (_, i) => {
    const status = weighted(STATUSES, STATUS_WEIGHTS, rand);
    const personalised = rand() > 0.42;
    const last4 = personalised
      ? String(1000 + Math.floor(rand() * 8999)).slice(-4)
      : null;

    return {
      id: `cd-${FIRST_PAGE.length + i + 1}`,
      refId: ids[i],
      cardNumberMasked: last4 ? `•••• •••• •••• ${last4}` : null,
      cardNo: cardNo(rand, stamps[i]),
      last4,
      balance: status === "Success" ? null : Number((rand() * 1400).toFixed(2)),
      currency: "USD",
      product: pick(CARD_PRODUCTS, rand),
      status,
      createdAt: stamps[i],
    } satisfies Card;
  });

  return [...authored, ...tail];
}

export const cards: Card[] = build();

export const cardStats = {
  total: cards.length,
  normal: cards.filter((c) => c.status === "Normal").length,
  frozen: cards.filter((c) => c.status === "Frozen").length,
  pending: cards.filter((c) => c.status === "Pending").length,
  series: {
    total: smoothSeries("cards-total", 26),
    normal: smoothSeries("cards-active", 26),
    frozen: smoothSeries("cards-frozen", 26),
    pending: smoothSeries("cards-pending", 26),
  },
};

export default cards;
