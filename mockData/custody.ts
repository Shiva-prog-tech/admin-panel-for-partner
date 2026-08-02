// ===========================================================================
// Custody — client balances held on the tenant's behalf.
//
// Three views feed the Custody screen: per-asset client balances (the tiles),
// the tenant pool balance per asset/chain, and the withdrawal queue.
// ===========================================================================
import type { CustodyAssetTile, CustodyWithdrawal, FeeSchedule, PoolBalance, WithdrawalStatus } from "@/modules/CustodyModule/types";
import { custodyBalances } from "./dashboard";
import { descendingStamps, hashSeed, pick, refIds, seededRandom, weighted } from "./seed";

/** Tiles across the top of the Custody page — one per held balance. */
export const custodyAssetTiles: CustodyAssetTile[] = [
  { id: "ct-1", asset: "USDT", balance: "35.8172204", clients: 1 },
  { id: "ct-2", asset: "TRX", balance: "2.58785823", clients: 1 },
  { id: "ct-3", asset: "USDT", balance: "1.549209", clients: 1 },
  { id: "ct-4", asset: "USDT", balance: "476.2700019", clients: 1 },
  { id: "ct-5", asset: "USDC", balance: "15", clients: 1 },
];

export const feeSchedule: FeeSchedule = {
  deposit: "0 bps",
  withdrawal: "25 bps + $0.00",
  monthly: "$0.00",
  approvalRequired: "No",
};

/** One pooled balance per asset/chain pair. */
export const poolBalances: PoolBalance[] = [
  { id: "pb-1", asset: "USDT", chain: "tron", balance: "476.2700019", updatedAt: "2026-07-28T20:36:23" },
  { id: "pb-2", asset: "USDT", chain: "polygon", balance: "35.8172204", updatedAt: "2026-07-27T12:08:31" },
  { id: "pb-3", asset: "USDC", chain: "eth", balance: "15", updatedAt: "2026-07-24T18:30:45" },
  { id: "pb-4", asset: "TRX", chain: "tron", balance: "2.58785823", updatedAt: "2026-07-28T18:24:35" },
  { id: "pb-5", asset: "USDT", chain: "eth", balance: "1.549209", updatedAt: "2026-07-23T20:25:00" },
];

const AUTHORED_WITHDRAWALS: Array<Omit<CustodyWithdrawal, "id">> = [
  { createdAt: "2026-07-27T12:08:31", refId: "6a5de27dd04790d52296e4c5", asset: "USDT", amount: "30.85831", status: "Approved", reason: null, to: "0x03291f7b6c48ad5e2019cf83b7d41ae6529afd60" },
  { createdAt: "2026-07-27T12:04:53", refId: "6a65ac5fd04790d52296ef84", asset: "USDT", amount: "10.931", status: "Approved", reason: null, to: "0xe2c751380b4a9fd6187e05c3a24bd9107fe6321c" },
  { createdAt: "2026-07-12T22:15:27", refId: "6a523a1f6852a9e227b97fb0", asset: "USDT", amount: "5", status: "Approved", reason: null, to: "TJyGeBHVTE9dLm4kQ2xPzR7sWn1CbUa5Yq" },
  { createdAt: "2026-07-09T17:24:03", refId: "6a4763f55f023d25d37ec2c9", asset: "TRX", amount: "6", status: "Approved", reason: null, to: "TBMyzM4ZBX7kR2wLpQ9sVn3dHa6CfUe1Gt" },
  { createdAt: "2026-07-08T15:27:26", refId: "6a44ed14584660f1d02d6d34", asset: "TRX", amount: "10", status: "Approved", reason: null, to: "TSmoHpbDtz5nQ8wKrL2xVc7fBa4YeUj1Mp" },
  { createdAt: "2026-07-07T23:56:39", refId: "6a4763f55f023d25d37ec2c9", asset: "TRX", amount: "5", status: "Approved", reason: null, to: "TBMyzM4ZBX7kR2wLpQ9sVn3dHa6CfUe1Gt" },
  { createdAt: "2026-07-07T23:54:57", refId: "6a4763f55f023d25d37ec2c9", asset: "TRX", amount: "10", status: "Approved", reason: null, to: "TBMyzM4ZBX7kR2wLpQ9sVn3dHa6CfUe1Gt" },
  { createdAt: "2026-07-06T05:18:47", refId: "6a48db6a6852a9e227b9785e", asset: "TRX", amount: "131.79154", status: "Approved", reason: null, to: "TXLhfJWVqx3mP7nRt5wKcL9dBa2YeUo4Gs" },
  { createdAt: "2026-07-04T17:15:33", refId: "6a48db6a6852a9e227b9785e", asset: "TRX", amount: "7", status: "Approved", reason: null, to: "TBMyzM4ZBX7kR2wLpQ9sVn3dHa6CfUe1Gt" },
  { createdAt: "2026-07-04T15:54:24", refId: "6a4763f55f023d25d37ec2c9", asset: "TRX", amount: "3", status: "Approved", reason: null, to: "TMA1H7Kk7XqW9pR4nLt2sVc6dBa8YeUj3G" },
];

const WITHDRAWAL_TOTAL = 26;

const STATUSES: WithdrawalStatus[] = [
  "Approved",
  "Completed",
  "Processing",
  "Pending",
  "Failed",
];
const STATUS_WEIGHTS = [40, 26, 12, 14, 8];

const FAILURE_REASONS = [
  "Destination address failed screening",
  "Insufficient pool balance at broadcast time",
  "Network fee spike — retry queued",
] as const;

const ADDRESSES = [
  "TBMyzM4ZBX7kR2wLpQ9sVn3dHa6CfUe1Gt",
  "TJyGeBHVTE9dLm4kQ2xPzR7sWn1CbUa5Yq",
  "0x03291f7b6c48ad5e2019cf83b7d41ae6529afd60",
  "0xe2c751380b4a9fd6187e05c3a24bd9107fe6321c",
  "TXLhfJWVqx3mP7nRt5wKcL9dBa2YeUo4Gs",
] as const;

const WITHDRAWAL_ASSETS = ["USDT", "USDC", "TRX"] as const;

function buildWithdrawals(): CustodyWithdrawal[] {
  const rand = seededRandom(hashSeed("custody-withdrawals"));
  const tailCount = WITHDRAWAL_TOTAL - AUTHORED_WITHDRAWALS.length;
  const refs = refIds("withdrawal-refs", tailCount, 24);
  const stamps = descendingStamps(
    "withdrawal-stamps",
    AUTHORED_WITHDRAWALS[AUTHORED_WITHDRAWALS.length - 1].createdAt,
    tailCount,
    { minGap: 600, maxGap: 4600 }
  );

  const authored: CustodyWithdrawal[] = AUTHORED_WITHDRAWALS.map((row, i) => ({
    id: `wq-${i + 1}`,
    ...row,
  }));

  const tail: CustodyWithdrawal[] = Array.from({ length: tailCount }, (_, i) => {
    const status = weighted(STATUSES, STATUS_WEIGHTS, rand);
    return {
      id: `wq-${AUTHORED_WITHDRAWALS.length + i + 1}`,
      createdAt: stamps[i],
      refId: refs[i],
      asset: pick(WITHDRAWAL_ASSETS, rand),
      amount: String(Number((1 + rand() * 220).toFixed(5))),
      status,
      reason: status === "Failed" ? pick(FAILURE_REASONS, rand) : null,
      to: pick(ADDRESSES, rand),
    } satisfies CustodyWithdrawal;
  });

  return [...authored, ...tail];
}

export const custodyWithdrawals: CustodyWithdrawal[] = buildWithdrawals();

export const custodyStats = {
  balances: custodyAssetTiles.length,
  clients: custodyAssetTiles.reduce((acc, tile) => acc + tile.clients, 0),
  chains: new Set(poolBalances.map((p) => p.chain)).size,
  pendingWithdrawals: custodyWithdrawals.filter(
    (w) => w.status === "Pending" || w.status === "Processing"
  ).length,
};

/** "35.8172204 USDT · 2.58785823 TRX · …" — used by the Float ledger tile. */
export const custodySummaryLine = custodyAssetTiles
  .map((tile) => `${tile.balance} ${tile.asset}`)
  .join(" · ");

export { custodyBalances };
