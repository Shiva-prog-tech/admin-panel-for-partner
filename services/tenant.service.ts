// ===========================================================================
// Tenant service — cross-cutting, so it stays in the global services/ folder.
//
// The NavBar, the Float ledger and Settings all read tenant identity, which is
// why this is not scoped to a single module the way the resource services are.
// ===========================================================================
import http from "@/utils/axios";
import { Config, DEFAULT_TENANT } from "@/utils/Config";
import type { Tenant } from "@/types/global";

export const tenantService = {
  async current(): Promise<Tenant> {
    if (Config.features.mockData) return DEFAULT_TENANT;
    const { data } = await http.get<Tenant>("/tenant");
    return data;
  },

  async update(patch: Partial<Pick<Tenant, "name" | "email">>): Promise<Tenant> {
    if (Config.features.mockData) return { ...DEFAULT_TENANT, ...patch };
    const { data } = await http.patch<Tenant>("/tenant", patch);
    return data;
  },
};

export default tenantService;
