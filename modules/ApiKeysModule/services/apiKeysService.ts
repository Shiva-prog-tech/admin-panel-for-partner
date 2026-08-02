// ===========================================================================
// API keys — owned by ApiKeysModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { apiKeys } from "@/utils/mockData/apiKeys";
import type { ApiKey, Paginated } from "@/types/global";

export const apiKeysService = {
  list: (query: ListQuery = {}): Promise<Paginated<ApiKey>> =>
    fetchList<ApiKey>("/api-keys", apiKeys, query),

  exportCsv: (query: ListQuery = {}) => exportUrl("api-keys", query),
};

export default apiKeysService;
