// ===========================================================================
// Tenant / dashboard service
// ===========================================================================
import http from "@/utils/axios";
import { Config, DEFAULT_TENANT } from "@/utils/Config";
import { dashboardData } from "@/utils/mockData/dashboard";
import type { Tenant } from "@/types/global";

export interface DashboardResponse {
  tiles: typeof dashboardData.tiles;
  float: typeof dashboardData.float;
  custody: typeof dashboardData.custody;
  webhookIssues: number;
}

export const partnerService = {
  async tenant(): Promise<Tenant> {
    if (Config.features.mockData) return DEFAULT_TENANT;
    const { data } = await http.get<Tenant>("/tenant");
    return data;
  },

  async dashboard(rangeId: string): Promise<DashboardResponse> {
    if (Config.features.mockData) {
      return {
        tiles: dashboardData.tiles,
        float: dashboardData.float,
        custody: dashboardData.custody,
        webhookIssues: dashboardData.webhookIssues,
      };
    }
    const { data } = await http.get<DashboardResponse>("/dashboard", {
      params: { range: rangeId },
    });
    return data;
  },
};

export default partnerService;
