// ===========================================================================
// Custody — owned by CustodyModule.
//
// Three surfaces on one screen: the held-balance tiles, the tenant pool
// balances table and the withdrawal queue. They share an endpoint prefix, so
// they share a service rather than being split three ways.
// ===========================================================================
import http from "@/utils/axios";
import { Config } from "@/utils/Config";
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import {
  custodyAssetTiles,
  custodyWithdrawals,
  feeSchedule,
  poolBalances,
} from "@/utils/mockData/custody";
import type {
  CustodyAssetTile,
  CustodyWithdrawal,
  FeeSchedule,
  Paginated,
  PoolBalance,
} from "@/types/global";

export interface CustodyOverview {
  tiles: CustodyAssetTile[];
  fees: FeeSchedule;
}

export const custodyService = {
  /** Balance tiles + the read-only fee schedule. */
  async overview(): Promise<CustodyOverview> {
    if (Config.features.mockData) {
      return { tiles: custodyAssetTiles, fees: feeSchedule };
    }
    const { data } = await http.get<CustodyOverview>("/custody");
    return data;
  },

  poolBalances: (query: ListQuery = {}): Promise<Paginated<PoolBalance>> =>
    fetchList<PoolBalance>("/custody/pool-balances", poolBalances, query),

  withdrawals: (query: ListQuery = {}): Promise<Paginated<CustodyWithdrawal>> =>
    fetchList<CustodyWithdrawal>("/custody/withdrawals", custodyWithdrawals, query),

  exportPoolBalances: (query: ListQuery = {}) =>
    exportUrl("custody/pool-balances", query),
};

export default custodyService;
