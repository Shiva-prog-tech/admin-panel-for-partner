// ===========================================================================
// Physical card orders — owned by CardOrdersModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { cardOrders } from "@/mockData/cardOrders";
import type { Paginated } from "@/types/global";
import type { CardOrder } from "../types";

export const cardOrdersService = {
  list: (query: ListQuery = {}): Promise<Paginated<CardOrder>> =>
    fetchList<CardOrder>("/card-orders", cardOrders, query),

  exportCsv: (query: ListQuery = {}) => exportUrl("card-orders", query),
};

export default cardOrdersService;
