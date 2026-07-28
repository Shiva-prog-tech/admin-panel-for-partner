// ===========================================================================
// Crypto transactions dataset
// ===========================================================================
import type { CryptoTx, CryptoTxStatus } from "@/types/global";
import { smoothSeries } from "@/utils/helper";
import { descendingStamps, hashSeed, pick, refIds, seededRandom, weighted } from "./seed";

const TOTAL = 96;

const ASSETS = [
  { symbol: "USDT", network: "TRON", usd: 1 },
  { symbol: "USDT", network: "Ethereum", usd: 1 },
  { symbol: "USDT", network: "BSC", usd: 1 },
  { symbol: "USDC", network: "Ethereum", usd: 1 },
  { symbol: "TRX", network: "TRON", usd: 0.132 },
] as const;

const STATUSES: CryptoTxStatus[] = ["Confirmed", "Pending", "Failed"];
const STATUS_WEIGHTS = [84, 11, 5];

function build(): CryptoTx[] {
  const rand = seededRandom(hashSeed("crypto-txs"));
  const hashes = refIds("crypto-hashes", TOTAL, 64);
  const stamps = descendingStamps("crypto-stamps", "2026-07-29T09:12:04", TOTAL, {
    minGap: 12,
    maxGap: 420,
  });

  return Array.from({ length: TOTAL }, (_, i) => {
    const asset = pick(ASSETS, rand);
    const status = weighted(STATUSES, STATUS_WEIGHTS, rand);
    const units = Number((0.5 + rand() * 720).toFixed(6));

    return {
      id: `cx-${i + 1}`,
      hash: hashes[i],
      asset: asset.symbol,
      network: asset.network,
      direction: rand() > 0.42 ? "in" : "out",
      amount: String(units),
      usdValue: Number((units * asset.usd).toFixed(2)),
      confirmations: status === "Confirmed" ? 20 + Math.floor(rand() * 400) : Math.floor(rand() * 6),
      status,
      createdAt: stamps[i],
    } satisfies CryptoTx;
  });
}

export const cryptoTxs: CryptoTx[] = build();

export const cryptoStats = {
  total: cryptoTxs.length,
  confirmed: cryptoTxs.filter((t) => t.status === "Confirmed").length,
  pending: cryptoTxs.filter((t) => t.status === "Pending").length,
  inboundUsd: Number(
    cryptoTxs
      .filter((t) => t.direction === "in" && t.status === "Confirmed")
      .reduce((acc, t) => acc + t.usdValue, 0)
      .toFixed(2)
  ),
  series: {
    total: smoothSeries("cx-total", 26),
    confirmed: smoothSeries("cx-confirmed", 26),
    pending: smoothSeries("cx-pending", 26),
    inbound: smoothSeries("cx-inbound", 26),
  },
};

export default cryptoTxs;
