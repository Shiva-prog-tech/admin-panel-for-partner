// ===========================================================================
// Cardholders dataset â€” 84 records (64 approved / 12 rejected / 8 pending)
// ===========================================================================
import type { Cardholder, CardholderStatus } from "@/modules/CardholdersModule/types";
import { smoothSeries } from "@/utils/helper";
import { CARD_PRODUCTS, REJECTION_REASONS } from "@/types/constants";
import { descendingStamps, hashSeed, pick, refIds, seededRandom, weighted } from "./seed";

const FIRST_PAGE: Cardholder[] = [
  {
    id: "ch-1",
    refId: "6a68d00a11e300cb9f57e1e3",
    product: "prod_111059",
    status: "Approved",
    reason: null,
    cards: 2,
    wallets: 1,
    deposited: null,
    createdAt: "2025-05-28T21:26:09",
  },
  {
    id: "ch-2",
    refId: "6a6958d11c39bc0d457c148",
    product: "prod_111059",
    status: "Rejected",
    reason:
      "An issue was detected with the document and verification could not be completed",
    cards: 0,
    wallets: 0,
    deposited: null,
    createdAt: "2025-05-28T17:13:46",
  },
  {
    id: "ch-3",
    refId: "6a687d9011e300cb9f57e10d",
    product: "prod_111031",
    status: "Approved",
    reason: null,
    cards: 1,
    wallets: 3,
    deposited: null,
    createdAt: "2025-05-28T15:30:37",
  },
  {
    id: "ch-4",
    refId: "6a67881f004780d52296f2af",
    product: "prod_111059",
    status: "Approved",
    reason: null,
    cards: 1,
    wallets: 0,
    deposited: null,
    createdAt: "2025-05-28T04:09:36",
  },
  {
    id: "ch-5",
    refId: "6a67dd211e300cb9f57e043",
    product: "prod_111059",
    status: "Approved",
    reason: null,
    cards: 0,
    wallets: 0,
    deposited: null,
    createdAt: "2025-05-28T01:04:08",
  },
  {
    id: "ch-6",
    refId: "6a679fecd04790d52296f2c1",
    product: "prod_111059",
    status: "Approved",
    reason: null,
    cards: 1,
    wallets: 0,
    deposited: null,
    createdAt: "2025-05-27T23:45:02",
  },
  {
    id: "ch-7",
    refId: "6a679817d04790d52296f2af",
    product: "prod_111031",
    status: "Rejected",
    reason:
      "The applicant uploaded screenshots instead of photos or scans.  |  [PASSPORT] The applicant uploaded screenshots instead of photos",
    cards: 0,
    wallets: 1,
    deposited: null,
    createdAt: "2025-05-27T23:11:14",
  },
  {
    id: "ch-8",
    refId: "6a6785d8f04790d52296f283",
    product: "prod_111059",
    status: "Approved",
    reason: null,
    cards: 0,
    wallets: 1,
    deposited: null,
    createdAt: "2025-05-27T21:53:45",
  },
  {
    id: "ch-9",
    refId: "6a676f85d04790d52296f23c",
    product: "prod_111059",
    status: "Rejected",
    reason: "The type of residence permit is not supported.",
    cards: 0,
    wallets: 2,
    deposited: null,
    createdAt: "2025-05-27T20:18:05",
  },
  {
    id: "ch-10",
    refId: "6a67336d04790d52296f1d2",
    product: "prod_111059",
    status: "Approved",
    reason: null,
    cards: 0,
    wallets: 2,
    deposited: 30,
    createdAt: "2025-05-27T16:01:44",
  },
];

const TOTAL = 84;
const GENERATED = TOTAL - FIRST_PAGE.length;

// The portal issues against two card products.
const PRODUCTS = CARD_PRODUCTS;

// Remaining rows must land the page totals on 64 / 12 / 8.
const REMAINING: CardholderStatus[] = [
  ...Array<CardholderStatus>(57).fill("Approved"),
  ...Array<CardholderStatus>(9).fill("Rejected"),
  ...Array<CardholderStatus>(8).fill("Pending"),
];

function buildTail(): Cardholder[] {
  const rand = seededRandom(hashSeed("cardholders-tail"));
  const ids = refIds("cardholders-refs", GENERATED, 24);
  const stamps = descendingStamps(
    "cardholders-stamps",
    FIRST_PAGE[FIRST_PAGE.length - 1].createdAt,
    GENERATED,
    { minGap: 50, maxGap: 780 }
  );

  // Deterministic shuffle so statuses are mixed but the totals stay exact.
  const statuses = [...REMAINING];
  for (let i = statuses.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [statuses[i], statuses[j]] = [statuses[j], statuses[i]];
  }

  return Array.from({ length: GENERATED }, (_, i) => {
    const status = statuses[i];
    const approved = status === "Approved";

    return {
      id: `ch-${FIRST_PAGE.length + i + 1}`,
      refId: ids[i],
      product: pick(PRODUCTS, rand),
      status,
      reason: status === "Rejected" ? pick(REJECTION_REASONS, rand) : null,
      cards: approved ? weighted([0, 1, 2, 3], [40, 38, 17, 5], rand) : 0,
      wallets: weighted([0, 1, 2, 3], [44, 32, 17, 7], rand),
      deposited: rand() > 0.82 ? Number((10 + rand() * 620).toFixed(0)) : null,
      createdAt: stamps[i],
    } satisfies Cardholder;
  });
}

export const cardholders: Cardholder[] = [...FIRST_PAGE, ...buildTail()];

export const cardholderStats = {
  total: 84,
  approved: 64,
  rejected: 12,
  pending: 8,
  series: {
    total: smoothSeries("ch-total", 26),
    approved: smoothSeries("ch-approved", 26),
    rejected: smoothSeries("ch-rejected", 26),
    pending: smoothSeries("ch-pending", 26),
  },
};

export default cardholders;

