// ===========================================================================
// Crypto transactions — owned by CryptoTxsModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { cryptoTxs } from "@/mockData/cryptoTxs";
import type { Paginated } from "@/types/global";
import type { CryptoTx } from "../types";

export const cryptoTxsService = {
  list: (query: ListQuery = {}): Promise<Paginated<CryptoTx>> =>
    fetchList<CryptoTx>("/crypto-txs", cryptoTxs, query, {
      searchFields: (row) => [row.refId, row.txHash, row.asset, row.chain, row.reason],
      filterFields: {
        asset: (row) => row.asset,
        dir: (row) => row.dir,
        reason: (row) => row.reason,
      },
      // `amount` is a raw-units string; sort it numerically like the table did.
      sortValue: (row, key) =>
        key === "amount"
          ? Number(row.amount)
          : (row as unknown as Record<string, string>)[key] ?? null,
    }),

  exportCsv: (query: ListQuery = {}) => exportUrl("crypto-txs", query),
};

export default cryptoTxsService;
