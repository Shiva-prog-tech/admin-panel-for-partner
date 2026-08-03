// ===========================================================================
// End users — owned by EndUsersModule.
//
// Co-located with the module that consumes it, following the reference's
// Components/FilmoraPopup/services/airdropService.ts convention. Cross-cutting
// services (auth, tenant) stay in the global services/ folder.
//
// This is the reference implementation for the service-driven listing pattern:
// the `MockShape` passed to fetchList tells it how to search, filter and sort
// the fixture, so mock mode returns the same page the API will.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import http from "@/utils/axios";
import { Config } from "@/utils/Config";
import { endUsers, endUserStats } from "@/mockData/endUsers";
import type { Paginated } from "@/types/global";
import type { EndUser } from "../types";

/** Sortable columns, declared once beside the service rather than in the page. */
const SORTABLE: Record<string, (row: EndUser) => string | number | null> = {
  refId: (r) => r.refId,
  cards: (r) => r.cards,
  cardholders: (r) => r.cardholders,
  cardTxs: (r) => r.cardTxs,
  walletTxs: (r) => r.walletTxs,
  deposited: (r) => r.deposited,
  createdAt: (r) => r.createdAt,
  status: (r) => r.status,
};

export const endUsersService = {
  list: (query: ListQuery = {}): Promise<Paginated<EndUser>> =>
    fetchList<EndUser>("/end-users", endUsers, query, {
      searchFields: (row) => [row.refId, row.status],
      statusOf: (row) => row.status,
      sortValue: (row, key) => SORTABLE[key]?.(row) ?? null,
    }),

  /**
   * Invites an end user.
   *
   * In mock mode the row is unshifted into the fixture so a refetch shows it —
   * the same sequence the live path takes (POST, then reload the list) rather
   * than holding an optimistic copy in component state.
   */
  async create(user: EndUser): Promise<EndUser> {
    if (Config.features.mockData) {
      endUsers.unshift(user);
      return user;
    }
    const { data } = await http.post<EndUser>("/end-users", user);
    return data;
  },

  async stats() {
    if (Config.features.mockData) return endUserStats;
    const { data } = await http.get<typeof endUserStats>("/end-users/stats");
    return data;
  },

  exportCsv: (query: ListQuery = {}) => exportUrl("end-users", query),
};

export default endUsersService;
