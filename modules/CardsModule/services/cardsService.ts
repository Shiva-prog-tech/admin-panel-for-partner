// ===========================================================================
// Cards — owned by CardsModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { cards } from "@/utils/mockData/cards";
import type { Card, Paginated } from "@/types/global";

export const cardsService = {
  list: (query: ListQuery = {}): Promise<Paginated<Card>> =>
    fetchList<Card>("/cards", cards, query),

  exportCsv: (query: ListQuery = {}) => exportUrl("cards", query),
};

export default cardsService;
