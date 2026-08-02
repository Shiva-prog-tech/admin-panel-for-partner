// ===========================================================================
// Card transactions — owned by TransactionModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { transactions } from "@/mockData/transactions";
import type { Paginated } from "@/types/global";
import type { Transaction } from "../types";

export const transactionsService = {
  list: (query: ListQuery = {}): Promise<Paginated<Transaction>> =>
    fetchList<Transaction>("/transactions", transactions, query),

  exportCsv: (query: ListQuery = {}) => exportUrl("transactions", query),
};

export default transactionsService;
