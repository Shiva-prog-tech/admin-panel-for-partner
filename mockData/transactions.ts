// ===========================================================================
// Card transactions dataset — spend and authorisations across all end users
// ===========================================================================
import type { Transaction, TxStatus, TxType } from "@/modules/TransactionModule/types";
import { smoothSeries, sum } from "@/utils/helper";
import { cards } from "./cards";
import { descendingStamps, hashSeed, pick, seededRandom, weighted } from "./seed";

/** Acquirer descriptors arrive upper-cased with the wallet in brackets. */
const MERCHANTS = [
  "CITY STAR LAUNDRY DUBAI AE(APPLE)",
  "STAR EXPRESS SUPERMARK Dubai AE(APPLE)",
  "CARREFOUR MKT MARINA C DUBAI AE(APPLE)",
  "MARITIME AND MERCANTIL",
  "CARRY FOOD SPMKT LLC",
  "PARK REGIS KRIS KIN HO",
  "TALABAT GENERAL TRADIN DUBAI AE",
  "CAREEM NOW DUBAI AE(GOOGLE)",
  "EMIRATES AIRLINE DUBAI AE",
  "NOON.COM DUBAI AE",
  "UBER BV AMSTERDAM NL",
  "APPLE SERVICES DUBLIN IE",
  "AMAZON WEB SERVICES SEATTLE US",
  "SPINNEYS DUBAI MARINA AE",
] as const;

const AUTHORED: Array<{
  refId: string;
  merchant: string;
  amount: number;
  status: TxStatus;
  last4: string | null;
  createdAt: string;
}> = [
  { refId: "6a4b90b66852a9e227b979e2", merchant: MERCHANTS[0], amount: 110.25, status: "Authorized", last4: "2040", createdAt: "2026-07-28T21:33:02" },
  { refId: "6a4b90b66852a9e227b979e2", merchant: MERCHANTS[1], amount: 57, status: "Authorized", last4: "2040", createdAt: "2026-07-28T21:18:02" },
  { refId: "6a4b90b66852a9e227b979e2", merchant: MERCHANTS[2], amount: 1.89, status: "Authorized", last4: "2040", createdAt: "2026-07-28T21:13:29" },
  { refId: "6a4b90b66852a9e227b979e2", merchant: MERCHANTS[3], amount: 478.49, status: "Authorized", last4: "4641", createdAt: "2026-07-28T20:39:33" },
  { refId: "6a4b90b66852a9e227b979e2", merchant: MERCHANTS[4], amount: 23, status: "Authorized", last4: "4641", createdAt: "2026-07-28T18:47:10" },
  { refId: "6a4b90b66852a9e227b979e2", merchant: MERCHANTS[4], amount: 52, status: "Authorized", last4: "4641", createdAt: "2026-07-28T18:46:41" },
  { refId: "6a590123f815ddbae6893588", merchant: MERCHANTS[5], amount: 100, status: "Authorized", last4: null, createdAt: "2026-07-28T18:27:49" },
  { refId: "6a590123f815ddbae6893588", merchant: MERCHANTS[5], amount: 100, status: "Failed", last4: null, createdAt: "2026-07-28T18:27:20" },
  { refId: "6a590123f815ddbae6893588", merchant: MERCHANTS[5], amount: 100, status: "Failed", last4: null, createdAt: "2026-07-28T18:18:35" },
];

const TOTAL = 148;

const STATUSES: TxStatus[] = ["Authorized", "Success", "Pending", "Failed"];
const STATUS_WEIGHTS = [58, 18, 10, 14];
const TYPES: TxType[] = ["auth", "purchase", "refund"];
const TYPE_WEIGHTS = [72, 22, 6];

function build(): Transaction[] {
  const rand = seededRandom(hashSeed("transactions-v2"));
  const tailCount = TOTAL - AUTHORED.length;
  const stamps = descendingStamps(
    "tx-stamps-v2",
    AUTHORED[AUTHORED.length - 1].createdAt,
    tailCount,
    { minGap: 6, maxGap: 260 }
  );

  const authored: Transaction[] = AUTHORED.map((row, i) => ({
    id: `tx-${i + 1}`,
    refId: row.refId,
    merchant: row.merchant,
    amount: row.amount,
    currency: "AED",
    type: "auth",
    status: row.status,
    last4: row.last4,
    createdAt: row.createdAt,
  }));

  const tail: Transaction[] = Array.from({ length: tailCount }, (_, i) => {
    const card = cards[Math.floor(rand() * cards.length)];
    return {
      id: `tx-${AUTHORED.length + i + 1}`,
      refId: card.refId,
      merchant: pick(MERCHANTS, rand),
      amount: Number((2 + rand() * 480).toFixed(2)),
      currency: "AED",
      type: weighted(TYPES, TYPE_WEIGHTS, rand),
      status: weighted(STATUSES, STATUS_WEIGHTS, rand),
      last4: card.last4,
      createdAt: stamps[i],
    } satisfies Transaction;
  });

  return [...authored, ...tail];
}

export const transactions: Transaction[] = build();

const approved = transactions.filter(
  (t) => t.status === "Authorized" || t.status === "Success"
);

export const transactionStats = {
  total: transactions.length,
  approvedVolume: Number(sum(approved.map((t) => t.amount)).toFixed(2)),
  failed: transactions.filter((t) => t.status === "Failed").length,
  approvalRate: Number(((approved.length / transactions.length) * 100).toFixed(1)),
  series: {
    total: smoothSeries("tx-total", 26),
    volume: smoothSeries("tx-volume", 26),
    failed: smoothSeries("tx-declined", 26),
    approval: smoothSeries("tx-approval", 26),
  },
};

export default transactions;
