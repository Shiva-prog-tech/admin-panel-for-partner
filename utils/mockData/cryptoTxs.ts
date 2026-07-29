// ===========================================================================
// Crypto transactions — deposits, withdrawals and settlements across custody.
//
// Tenant pool movements carry the reserved "_pool" reference and no tx hash
// (they are internal book entries, not on-chain transfers).
// ===========================================================================
import type { CryptoReason, CryptoTx, LedgerDirection } from "@/types/global";
import { smoothSeries } from "@/utils/helper";
import { descendingStamps, hashSeed, pick, refIds, seededRandom, weighted } from "./seed";

const POOL_REF = "_pool";

const AUTHORED: Array<{
  createdAt: string;
  refId: string;
  dir: LedgerDirection;
  asset: string;
  chain: string;
  amount: string;
  reason: CryptoReason;
  txHash: string | null;
}> = [
  { createdAt: "2026-07-28T20:36:23", refId: POOL_REF, dir: "debit", asset: "USDT", chain: "tron", amount: "303", reason: "settlement", txHash: null },
  { createdAt: "2026-07-28T20:35:30", refId: "6a4b90b66852a9e227b979e2", dir: "credit", asset: "USDT", chain: "tron", amount: "750", reason: "deposit", txHash: "a3d2e3ab02fb47c19d0e5a8b6f31c72d94ae10bb35f7c8d2e6194a05b7cf3d81" },
  { createdAt: "2026-07-28T18:46:36", refId: POOL_REF, dir: "debit", asset: "USDT", chain: "tron", amount: "47.19999973", reason: "settlement", txHash: null },
  { createdAt: "2026-07-28T18:24:35", refId: POOL_REF, dir: "debit", asset: "TRX", chain: "tron", amount: "158.62155646", reason: "settlement", txHash: null },
  { createdAt: "2026-07-28T12:20:21", refId: POOL_REF, dir: "debit", asset: "USDT", chain: "tron", amount: "808", reason: "settlement", txHash: null },
  { createdAt: "2026-07-28T12:19:30", refId: "6a4b90b66852a9e227b979e2", dir: "credit", asset: "USDT", chain: "tron", amount: "750", reason: "deposit", txHash: "f928599ca21d4e07b3c6f1a58d29e4b70cc3518af6d29e0b471a3fd85c2e6790" },
  { createdAt: "2026-07-28T09:52:10", refId: POOL_REF, dir: "debit", asset: "TRX", chain: "tron", amount: "250.00000457", reason: "settlement", txHash: null },
  { createdAt: "2026-07-28T09:51:30", refId: "6a4763f55f023d25d37ec2c9", dir: "credit", asset: "TRX", chain: "tron", amount: "250", reason: "deposit", txHash: "8a564d1ecda3f0b27c9145e6d80a3fb51c72e94dd6108b3a7f52c0e91b4d6873" },
  { createdAt: "2026-07-28T05:03:38", refId: POOL_REF, dir: "debit", asset: "USDT", chain: "tron", amount: "1502.20540282", reason: "settlement", txHash: null },
  { createdAt: "2026-07-28T04:50:40", refId: "6a5dcd56d04790d52296e495", dir: "credit", asset: "USDT", chain: "tron", amount: "1500", reason: "deposit", txHash: "a28041bb3e4691d0c7f253a8be1d64790fc35b28ad7e1c093f6a4b25de80c713" },
  { createdAt: "2026-07-28T03:33:15", refId: POOL_REF, dir: "debit", asset: "USDT", chain: "tron", amount: "1504.4999996", reason: "settlement", txHash: null },
];

const TOTAL = 96;

const REASONS: CryptoReason[] = ["deposit", "withdrawal", "settlement", "refund"];
const REASON_WEIGHTS = [38, 18, 38, 6];

const ASSETS = [
  { asset: "USDT", chain: "tron" },
  { asset: "USDT", chain: "eth" },
  { asset: "USDT", chain: "polygon" },
  { asset: "USDC", chain: "eth" },
  { asset: "TRX", chain: "tron" },
] as const;

function build(): CryptoTx[] {
  const rand = seededRandom(hashSeed("crypto-txs-v2"));
  const tailCount = TOTAL - AUTHORED.length;
  const hashes = refIds("crypto-hashes-v2", tailCount, 64);
  const userRefs = refIds("crypto-user-refs", tailCount, 24);
  const stamps = descendingStamps(
    "crypto-stamps-v2",
    AUTHORED[AUTHORED.length - 1].createdAt,
    tailCount,
    { minGap: 12, maxGap: 420 }
  );

  const authored: CryptoTx[] = AUTHORED.map((row, i) => ({
    id: `cx-${i + 1}`,
    ...row,
  }));

  const tail: CryptoTx[] = Array.from({ length: tailCount }, (_, i) => {
    const reason = weighted(REASONS, REASON_WEIGHTS, rand);
    const internal = reason === "settlement";
    const meta = pick(ASSETS, rand);
    const units = Number((0.5 + rand() * 1500).toFixed(8));

    return {
      id: `cx-${AUTHORED.length + i + 1}`,
      createdAt: stamps[i],
      refId: internal ? POOL_REF : userRefs[i],
      dir: reason === "deposit" || reason === "refund" ? "credit" : "debit",
      asset: meta.asset,
      chain: meta.chain,
      amount: String(units),
      reason,
      txHash: internal ? null : hashes[i],
    } satisfies CryptoTx;
  });

  return [...authored, ...tail];
}

export const cryptoTxs: CryptoTx[] = build();

export const cryptoStats = {
  total: cryptoTxs.length,
  deposits: cryptoTxs.filter((t) => t.reason === "deposit").length,
  settlements: cryptoTxs.filter((t) => t.reason === "settlement").length,
  withdrawals: cryptoTxs.filter((t) => t.reason === "withdrawal").length,
  series: {
    total: smoothSeries("cx-total", 26),
    deposits: smoothSeries("cx-confirmed", 26),
    settlements: smoothSeries("cx-pending", 26),
    withdrawals: smoothSeries("cx-inbound", 26),
  },
};

export default cryptoTxs;
