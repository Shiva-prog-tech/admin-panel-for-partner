// ===========================================================================
// Crypto transactions — owned by CryptoTxsModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { cryptoTxs } from "@/utils/mockData/cryptoTxs";
import type { CryptoTx, Paginated } from "@/types/global";

export const cryptoTxsService = {
  list: (query: ListQuery = {}): Promise<Paginated<CryptoTx>> =>
    fetchList<CryptoTx>("/crypto-txs", cryptoTxs, query),

  exportCsv: (query: ListQuery = {}) => exportUrl("crypto-txs", query),
};

export default cryptoTxsService;
