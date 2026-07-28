// ===========================================================================
// End users dataset — 103 records.
// The first page is authored to match the product spec row-for-row; the rest
// is seeded so pagination, sorting and search all have real data to work on.
// ===========================================================================
import type { EndUser, EndUserStatus } from "@/types/global";
import { smoothSeries } from "@/utils/helper";
import { descendingStamps, hashSeed, refIds, seededRandom, weighted } from "./seed";

const FIRST_PAGE: EndUser[] = [
  {
    id: "eu-1",
    refId: "6a690b01c39bc0d473e1e3",
    cards: 0,
    cardholders: 0,
    cardTxs: 0,
    walletTxs: 0,
    deposited: null,
    createdAt: "2026-07-28T21:20:06",
    status: "Active",
  },
  {
    id: "eu-2",
    refId: "6a6958d11c39bc0d457c148",
    cards: 0,
    cardholders: 0,
    cardTxs: 0,
    walletTxs: 0,
    deposited: null,
    createdAt: "2026-07-28T17:33:46",
    status: "Active",
  },
  {
    id: "eu-3",
    refId: "6a69769f11c39bc0d457e1e0",
    cards: 0,
    cardholders: 1,
    cardTxs: 0,
    walletTxs: 3,
    deposited: null,
    createdAt: "2026-07-28T15:30:37",
    status: "Active",
  },
  {
    id: "eu-4",
    refId: "6a69a0d21c39bc0d457e043",
    cards: 0,
    cardholders: 1,
    cardTxs: 0,
    walletTxs: 0,
    deposited: null,
    createdAt: "2026-07-28T04:08:36",
    status: "Invited",
  },
  {
    id: "eu-5",
    refId: "65ecf1a55fd8e8dc2c1e16c5",
    cards: 0,
    cardholders: 0,
    cardTxs: 0,
    walletTxs: 0,
    deposited: null,
    createdAt: "2026-07-28T01:04:08",
    status: "Invited",
  },
  {
    id: "eu-6",
    refId: "5ef975ed4a524c3552567e21",
    cards: 0,
    cardholders: 1,
    cardTxs: 0,
    walletTxs: 0,
    deposited: null,
    createdAt: "2026-07-27T23:52:29",
    status: "Invited",
  },
  {
    id: "eu-7",
    refId: "babf9833a9943956229bf24f",
    cards: 0,
    cardholders: 1,
    cardTxs: 0,
    walletTxs: 1,
    deposited: null,
    createdAt: "2026-07-27T23:11:14",
    status: "Active",
  },
  {
    id: "eu-8",
    refId: "6af7356d8449f0622b9f2f83",
    cards: 0,
    cardholders: 0,
    cardTxs: 0,
    walletTxs: 1,
    deposited: null,
    createdAt: "2026-07-27T21:53:45",
    status: "Active",
  },
  {
    id: "eu-9",
    refId: "6ab76fc9b947f0622b9f243c",
    cards: 0,
    cardholders: 0,
    cardTxs: 0,
    walletTxs: 2,
    deposited: null,
    createdAt: "2026-07-27T20:19:05",
    status: "Active",
  },
  {
    id: "eu-10",
    refId: "9ab73fc9b947f0622b9f123f2",
    cards: 0,
    cardholders: 0,
    cardTxs: 0,
    walletTxs: 2,
    deposited: 30,
    createdAt: "2026-07-27T16:01:44",
    status: "Suspended",
  },
];

const TOTAL = 103;
const GENERATED = TOTAL - FIRST_PAGE.length;

const STATUSES: EndUserStatus[] = ["Active", "Invited", "Suspended", "Closed"];
const STATUS_WEIGHTS = [72, 17, 7, 4];

function buildTail(): EndUser[] {
  const rand = seededRandom(hashSeed("end-users-tail"));
  const ids = refIds("end-users-refs", GENERATED, 22);
  const stamps = descendingStamps(
    "end-users-stamps",
    FIRST_PAGE[FIRST_PAGE.length - 1].createdAt,
    GENERATED,
    { minGap: 45, maxGap: 900 }
  );

  return Array.from({ length: GENERATED }, (_, i) => {
    const cards = weighted([0, 1, 2, 3], [72, 20, 6, 2], rand);
    const cardholders = weighted([0, 1, 2], [58, 34, 8], rand);
    const cardTxs = cards === 0 ? 0 : weighted([0, 1, 3, 7, 14], [30, 26, 22, 14, 8], rand);
    const walletTxs = weighted([0, 1, 2, 3, 5, 9], [42, 20, 15, 11, 8, 4], rand);
    const hasDeposit = rand() > 0.78;

    return {
      id: `eu-${FIRST_PAGE.length + i + 1}`,
      refId: ids[i],
      cards,
      cardholders,
      cardTxs,
      walletTxs,
      deposited: hasDeposit ? Number((10 + rand() * 940).toFixed(0)) : null,
      createdAt: stamps[i],
      status: weighted(STATUSES, STATUS_WEIGHTS, rand),
    } satisfies EndUser;
  });
}

export const endUsers: EndUser[] = [...FIRST_PAGE, ...buildTail()];

export const endUserStats = {
  total: 103,
  cardsIssued: 35,
  activeThisWeek: 84,
  activityEvents: 3084,
  series: {
    total: smoothSeries("eu-total", 26),
    cards: smoothSeries("eu-cards", 26),
    active: smoothSeries("eu-active", 26),
    events: smoothSeries("eu-events", 26),
  },
};

export default endUsers;
