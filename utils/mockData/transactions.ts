// ===========================================================================
// Card transactions dataset
// ===========================================================================
import type { Transaction, TxStatus } from "@/types/global";
import { smoothSeries, sum } from "@/utils/helper";
import { cards } from "./cards";
import { descendingStamps, hashSeed, pick, refIds, seededRandom, weighted } from "./seed";

const TOTAL = 148;

const MERCHANTS = [
  { name: "Amazon Web Services", mcc: "7372" },
  { name: "Booking.com", mcc: "4722" },
  { name: "Uber BV", mcc: "4121" },
  { name: "Apple Services", mcc: "5817" },
  { name: "Notion Labs", mcc: "7372" },
  { name: "Emirates Airlines", mcc: "3009" },
  { name: "Careem Pay", mcc: "4121" },
  { name: "Netflix International", mcc: "5815" },
  { name: "Google Cloud", mcc: "7372" },
  { name: "Spotify AB", mcc: "5815" },
  { name: "Shopify Inc", mcc: "5734" },
  { name: "Figma Inc", mcc: "7372" },
  { name: "Starbucks DXB", mcc: "5814" },
  { name: "Carrefour Market", mcc: "5411" },
] as const;

const STATUSES: TxStatus[] = ["Settled", "Pending", "Declined", "Reversed"];
const STATUS_WEIGHTS = [74, 12, 10, 4];

function build(): Transaction[] {
  const rand = seededRandom(hashSeed("transactions"));
  const ids = refIds("tx-refs", TOTAL, 20);
  const stamps = descendingStamps("tx-stamps", "2026-07-29T09:41:22", TOTAL, {
    minGap: 6,
    maxGap: 260,
  });

  return Array.from({ length: TOTAL }, (_, i) => {
    const merchant = pick(MERCHANTS, rand);
    const card = cards[Math.floor(rand() * cards.length)];

    return {
      id: `tx-${i + 1}`,
      refId: ids[i],
      merchant: merchant.name,
      mcc: merchant.mcc,
      cardLast4: card.last4,
      amount: Number((2 + rand() * 480).toFixed(2)),
      currency: "USD",
      status: weighted(STATUSES, STATUS_WEIGHTS, rand),
      createdAt: stamps[i],
    } satisfies Transaction;
  });
}

export const transactions: Transaction[] = build();

const settled = transactions.filter((t) => t.status === "Settled");

export const transactionStats = {
  total: transactions.length,
  settledVolume: Number(sum(settled.map((t) => t.amount)).toFixed(2)),
  declined: transactions.filter((t) => t.status === "Declined").length,
  approvalRate: Number(((settled.length / transactions.length) * 100).toFixed(1)),
  series: {
    total: smoothSeries("tx-total", 26),
    volume: smoothSeries("tx-volume", 26),
    declined: smoothSeries("tx-declined", 26),
    approval: smoothSeries("tx-approval", 26),
  },
};

export default transactions;
