// ===========================================================================
// Dashboard dataset — the exact figures shown in the product spec
// ===========================================================================
import type { CustodyBalance, FloatSummary, MetricTile } from "@/types/global";
import { jaggedSeries } from "@/utils/helper";

export const dashboardTiles: MetricTile[] = [
  {
    id: "end-users",
    label: "End users",
    value: "103",
    icon: "users",
    delta: { value: 12.5, direction: "up", label: "from last week" },
    series: jaggedSeries("dash-end-users", 36, 46, 24),
  },
  {
    id: "cards",
    label: "Cards",
    value: "35",
    icon: "card",
    delta: { value: 8.2, direction: "up", label: "from last week" },
    series: jaggedSeries("dash-cards", 36, 42, 22),
  },
  {
    id: "cardholders",
    label: "Cardholders",
    value: "84",
    icon: "user",
    delta: { value: 15.3, direction: "up", label: "from last week" },
    series: jaggedSeries("dash-cardholders", 36, 50, 26),
  },
  {
    id: "api-calls",
    label: "API calls (24h)",
    value: "3083",
    icon: "activity",
    caption: "Machine API traffic",
    delta: { value: 21.6, direction: "up", label: "from last week" },
    series: jaggedSeries("dash-api-calls", 36, 54, 30),
  },
];

export const floatSummary: FloatSummary = {
  currency: "USD",
  amount: 1924.34,
  status: "active",
  series: [
    { label: "May 23", value: 612.4 },
    { label: "May 24", value: 1298.6 },
    { label: "May 25", value: 1042.1 },
    { label: "May 26", value: 1268.5 },
    { label: "May 27", value: 1411.8 },
    { label: "May 28", value: 1924.34 },
    { label: "May 29", value: 1846.2 },
  ],
};

export const custodyBalances: CustodyBalance[] = [
  { id: "cb-1", symbol: "USDT", network: "TRON", amount: "35.8172204" },
  { id: "cb-2", symbol: "TRX", network: "TRON", amount: "2.58785823" },
  { id: "cb-3", symbol: "USDT", network: "Ethereum", amount: "1.549209" },
  { id: "cb-4", symbol: "USDT", network: "BSC", amount: "476.2700019" },
  { id: "cb-5", symbol: "USDC", network: "Ethereum", amount: "15" },
];

export const dashboardData = {
  tiles: dashboardTiles,
  float: floatSummary,
  custody: custodyBalances,
  webhookIssues: 0,
};

export default dashboardData;
