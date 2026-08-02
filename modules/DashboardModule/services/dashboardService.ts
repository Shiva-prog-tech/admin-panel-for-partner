// ===========================================================================
// Dashboard — owned by DashboardModule.
//
// This was the second half of the old services/partner.service.ts. Tenant
// identity is cross-cutting and stayed global (services/tenant.service.ts);
// the dashboard payload is read by exactly one module, so it lives here.
// ===========================================================================
import http from "@/utils/axios";
import { Config } from "@/utils/Config";
import { dashboardData } from "@/utils/mockData/dashboard";
import type { CustodyBalance, FloatSummary, MetricTile } from "@/types/global";

export interface DashboardPayload {
  tiles: MetricTile[];
  float: FloatSummary;
  custody: CustodyBalance[];
  webhookIssues: number;
}

export const dashboardService = {
  /** `rangeId` matches one of DATE_RANGES in types/constants. */
  async overview(rangeId: string): Promise<DashboardPayload> {
    if (Config.features.mockData) {
      return {
        tiles: dashboardData.tiles,
        float: dashboardData.float,
        custody: dashboardData.custody,
        webhookIssues: dashboardData.webhookIssues,
      };
    }

    const { data } = await http.get<DashboardPayload>("/dashboard", {
      params: { range: rangeId },
    });
    return data;
  },
};

export default dashboardService;
