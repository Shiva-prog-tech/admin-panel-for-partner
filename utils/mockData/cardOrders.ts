// ===========================================================================
// Card orders dataset
// ===========================================================================
import type { CardOrder, CardOrderStatus } from "@/types/global";
import { smoothSeries } from "@/utils/helper";
import { COUNTRIES } from "@/utils/CountryData";
import { cardholders } from "./cardholders";
import { descendingStamps, hashSeed, pick, refIds, seededRandom, weighted } from "./seed";

const TOTAL = 42;

const PRODUCTS = [
  "prod_TM1031",
  "prod_TM1042",
  "prod_TM1049",
  "prod_TM1060",
  "prod_TM110A",
] as const;

const STATUSES: CardOrderStatus[] = [
  "Delivered",
  "Shipped",
  "In production",
  "Requested",
  "Cancelled",
];
const STATUS_WEIGHTS = [44, 20, 16, 14, 6];

function build(): CardOrder[] {
  const rand = seededRandom(hashSeed("card-orders"));
  const ids = refIds("order-refs", TOTAL, 20);
  const stamps = descendingStamps("order-stamps", "2026-07-28T18:12:40", TOTAL, {
    minGap: 240,
    maxGap: 3200,
  });

  return Array.from({ length: TOTAL }, (_, i) => {
    const country = pick(COUNTRIES, rand);

    return {
      id: `co-${i + 1}`,
      refId: ids[i],
      cardholderRef: cardholders[Math.floor(rand() * cardholders.length)].refId,
      product: pick(PRODUCTS, rand),
      quantity: weighted([1, 1, 2, 5], [70, 14, 11, 5], rand),
      destination: `${country.name} (${country.code})`,
      status: weighted(STATUSES, STATUS_WEIGHTS, rand),
      createdAt: stamps[i],
    } satisfies CardOrder;
  });
}

export const cardOrders: CardOrder[] = build();

export const cardOrderStats = {
  total: cardOrders.length,
  delivered: cardOrders.filter((o) => o.status === "Delivered").length,
  inTransit: cardOrders.filter((o) => o.status === "Shipped").length,
  pending: cardOrders.filter(
    (o) => o.status === "Requested" || o.status === "In production"
  ).length,
  series: {
    total: smoothSeries("co-total", 26),
    delivered: smoothSeries("co-delivered", 26),
    transit: smoothSeries("co-transit", 26),
    pending: smoothSeries("co-pending", 26),
  },
};

export default cardOrders;
