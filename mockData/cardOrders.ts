// ===========================================================================
// Physical card orders dataset
// ===========================================================================
import type { CardOrder, CardOrderStatus } from "@/modules/CardOrdersModule/types";
import { smoothSeries } from "@/utils/helper";
import { COUNTRIES } from "@/utils/CountryData";
import { cardholders } from "./cardholders";
import { descendingStamps, hashSeed, pick, seededRandom, weighted } from "./seed";

const TOTAL = 14;

const STATUSES: CardOrderStatus[] = ["Pending", "Shipped", "Delivered"];
const STATUS_WEIGHTS = [22, 26, 52];

const RECIPIENTS = [
  "Aarav Menon",
  "Layla Haddad",
  "Tomás Ferreira",
  "Chen Wei",
  "Priya Nair",
  "Omar Al Farsi",
  "Sofia Rossi",
  "Daniel Okoye",
  "Hana Suzuki",
  "Marcus Lindqvist",
  "Fatima Zahra",
  "Elena Petrova",
  "Kwame Mensah",
  "Isabella Duarte",
] as const;

/** Courier references only exist once the order leaves production. */
function tracking(rand: () => number): string {
  let digits = "";
  for (let i = 0; i < 10; i += 1) digits += Math.floor(rand() * 10);
  return `SWP${digits}AE`;
}

function build(): CardOrder[] {
  const rand = seededRandom(hashSeed("card-orders-v2"));
  const stamps = descendingStamps("order-stamps-v2", "2026-07-28T18:12:40", TOTAL, {
    minGap: 240,
    maxGap: 3200,
  });

  return Array.from({ length: TOTAL }, (_, i) => {
    const country = pick(COUNTRIES, rand);
    const status = weighted(STATUSES, STATUS_WEIGHTS, rand);

    return {
      id: `co-${i + 1}`,
      order: `ORD-${String(2041 - i).padStart(4, "0")}`,
      refId: cardholders[Math.floor(rand() * cardholders.length)].refId,
      status,
      recipient: RECIPIENTS[i % RECIPIENTS.length],
      country: `${country.name} (${country.code})`,
      tracking: status === "Pending" ? null : tracking(rand),
      createdAt: stamps[i],
    } satisfies CardOrder;
  });
}

export const cardOrders: CardOrder[] = build();

export const cardOrderStats = {
  total: cardOrders.length,
  delivered: cardOrders.filter((o) => o.status === "Delivered").length,
  shipped: cardOrders.filter((o) => o.status === "Shipped").length,
  pending: cardOrders.filter((o) => o.status === "Pending").length,
  series: {
    total: smoothSeries("co-total", 26),
    delivered: smoothSeries("co-delivered", 26),
    shipped: smoothSeries("co-transit", 26),
    pending: smoothSeries("co-pending", 26),
  },
};

export default cardOrders;
