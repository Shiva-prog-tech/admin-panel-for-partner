// ===========================================================================
// Cardholders — owned by CardholdersModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { cardholders } from "@/mockData/cardholders";
import type { Paginated } from "@/types/global";
import type { Cardholder } from "../types";

export const cardholdersService = {
  list: (query: ListQuery = {}): Promise<Paginated<Cardholder>> =>
    fetchList<Cardholder>("/cardholders", cardholders, query),

  exportCsv: (query: ListQuery = {}) => exportUrl("cardholders", query),
};

export default cardholdersService;
