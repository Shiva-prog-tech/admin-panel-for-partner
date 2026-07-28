import { NextResponse } from "next/server";
import { custodyWallets, custodyStats } from "@/utils/mockData/custody";
import { custodyBalances } from "@/utils/mockData/dashboard";

/** GET /api/custody — wallets, balances and roll-ups. */
export async function GET() {
  return NextResponse.json({
    wallets: custodyWallets,
    balances: custodyBalances,
    stats: custodyStats,
  });
}
