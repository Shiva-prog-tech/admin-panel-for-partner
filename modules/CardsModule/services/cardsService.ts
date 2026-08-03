// ===========================================================================
// Cards — owned by CardsModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { cards } from "@/mockData/cards";
import type { Paginated } from "@/types/global";
import type { Card } from "../types";

export const cardsService = {
  list: (query: ListQuery = {}): Promise<Paginated<Card>> =>
    fetchList<Card>("/cards", cards, query, {
      searchFields: (row) => [row.refId, row.cardNo, row.last4, row.product, row.status],
      statusOf: (row) => row.status,
      filterFields: { status: (row) => row.status },
      sortValue: (row, key) =>
        (row as unknown as Record<string, string | number | null>)[key] ?? null,
    }),

  exportCsv: (query: ListQuery = {}) => exportUrl("cards", query),
};

export default cardsService;
