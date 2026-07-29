import { NextResponse } from "next/server";
import {
  custodyAssetTiles,
  custodyStats,
  custodyWithdrawals,
  feeSchedule,
  poolBalances,
} from "@/utils/mockData/custody";
import { custodyBalances } from "@/utils/mockData/dashboard";

/** GET /api/custody — held balances, pool balances, fees and withdrawals. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asset = (searchParams.get("asset") ?? "").toUpperCase();
  const status = searchParams.get("status") ?? "";

  const pools = asset
    ? poolBalances.filter((p) => p.asset.toUpperCase() === asset)
    : poolBalances;

  let withdrawals = custodyWithdrawals;
  if (asset) withdrawals = withdrawals.filter((w) => w.asset.toUpperCase() === asset);
  if (status) withdrawals = withdrawals.filter((w) => w.status === status);

  return NextResponse.json({
    tiles: custodyAssetTiles,
    balances: custodyBalances,
    fees: feeSchedule,
    poolBalances: pools,
    withdrawals,
    stats: custodyStats,
  });
}
