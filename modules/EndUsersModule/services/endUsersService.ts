// ===========================================================================
// End users — owned by EndUsersModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { endUsers } from "@/utils/mockData/endUsers";
import type { EndUser, Paginated } from "@/types/global";

export const endUsersService = {
  list: (query: ListQuery = {}): Promise<Paginated<EndUser>> =>
    fetchList<EndUser>("/end-users", endUsers, query),

  exportCsv: (query: ListQuery = {}) => exportUrl("end-users", query),
};

export default endUsersService;
