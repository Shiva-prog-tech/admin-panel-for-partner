// ===========================================================================
// Cardholders — owned by CardholdersModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import http from "@/utils/axios";
import { Config } from "@/utils/Config";
import { cardholders } from "@/mockData/cardholders";
import type { Paginated } from "@/types/global";
import type { Cardholder } from "../types";

export const cardholdersService = {
  list: (query: ListQuery = {}): Promise<Paginated<Cardholder>> =>
    fetchList<Cardholder>("/cardholders", cardholders, query, {
      searchFields: (row) => [row.refId, row.product, row.status, row.reason],
      statusOf: (row) => row.status,
      sortValue: (row, key) =>
        (row as unknown as Record<string, string | number | null>)[key] ?? null,
    }),

  /** Submits an application; mock mode unshifts the fixture so a refetch shows it. */
  async create(row: Cardholder): Promise<Cardholder> {
    if (Config.features.mockData) {
      cardholders.unshift(row);
      return row;
    }
    const { data } = await http.post<Cardholder>("/cardholders", row);
    return data;
  },

  exportCsv: (query: ListQuery = {}) => exportUrl("cardholders", query),
};

export default cardholdersService;
