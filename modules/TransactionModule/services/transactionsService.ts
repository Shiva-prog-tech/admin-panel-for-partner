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
import { TX_STATUS_BUCKETS } from "../constants";

export const transactionsService = {
  list: (query: ListQuery = {}): Promise<Paginated<Transaction>> =>
    fetchList<Transaction>("/transactions", transactions, query, {
      searchFields: (row) => [row.refId, row.merchant, row.last4, row.status],
      filterFields: { type: (row) => row.type },
      // The status axis is a bucket, not a field match: "Success" also covers
      // rows the issuer reports as "Authorized".
      predicate: (row, q) => {
        const bucket = q.filters?.status;
        if (!bucket) return true;
        return (TX_STATUS_BUCKETS[bucket] ?? [bucket]).includes(row.status);
      },
      sortValue: (row, key) =>
        (row as unknown as Record<string, string | number | null>)[key] ?? null,
    }),

  exportCsv: (query: ListQuery = {}) => exportUrl("transactions", query),
};

export default transactionsService;
