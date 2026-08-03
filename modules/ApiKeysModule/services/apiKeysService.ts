// ===========================================================================
// API keys — owned by ApiKeysModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { apiKeys } from "@/mockData/apiKeys";
import type { Paginated } from "@/types/global";
import type { ApiKey } from "../types";

export const apiKeysService = {
  list: (query: ListQuery = {}): Promise<Paginated<ApiKey>> =>
    fetchList<ApiKey>("/api-keys", apiKeys, query, {
      searchFields: (row) => [row.prefix, row.label, row.scope, row.environment, row.state],
      statusOf: (row) => row.state,
      sortValue: (row, key) =>
        (row as unknown as Record<string, string | number | null>)[key] ?? null,
    }),

  exportCsv: (query: ListQuery = {}) => exportUrl("api-keys", query),
};

export default apiKeysService;
