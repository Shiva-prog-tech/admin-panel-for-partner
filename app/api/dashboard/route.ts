import { NextResponse } from "next/server";
import { dashboardData } from "@/utils/mockData/dashboard";
import { DATE_RANGES, DEFAULT_RANGE_ID } from "@/types/constants";
import { DEFAULT_TENANT } from "@/utils/Config";

/** GET /api/dashboard?range=7d */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rangeId = searchParams.get("range") ?? DEFAULT_RANGE_ID;
  const range = DATE_RANGES.find((r) => r.id === rangeId) ?? DATE_RANGES[0];

  return NextResponse.json({
    tenant: DEFAULT_TENANT,
    range,
    tiles: dashboardData.tiles,
    float: dashboardData.float,
    custody: dashboardData.custody,
    webhookIssues: dashboardData.webhookIssues,
  });
}
