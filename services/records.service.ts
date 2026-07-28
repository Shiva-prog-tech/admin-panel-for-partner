// ===========================================================================
// Record listing service — one thin wrapper per resource in the sidebar
// ===========================================================================
import http from "@/utils/axios";
import { Config } from "@/utils/Config";
import { endUsers } from "@/utils/mockData/endUsers";
import { cardholders } from "@/utils/mockData/cardholders";
import { cards } from "@/utils/mockData/cards";
import { transactions } from "@/utils/mockData/transactions";
import { cardOrders } from "@/utils/mockData/cardOrders";
import { floatEntries } from "@/utils/mockData/floatLedger";
import { cryptoTxs } from "@/utils/mockData/cryptoTxs";
import { webhookEndpoints } from "@/utils/mockData/webhooks";
import { apiKeys } from "@/utils/mockData/apiKeys";
import { auditEvents } from "@/utils/mockData/auditLog";
import type {
  ApiKey,
  AuditEvent,
  Card,
  CardOrder,
  Cardholder,
  CryptoTx,
  EndUser,
  FloatEntry,
  Paginated,
  Transaction,
  WebhookEndpoint,
} from "@/types/global";

export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string[];
  from?: string;
  to?: string;
}

async function list<T>(
  path: string,
  fallback: T[],
  query: ListQuery
): Promise<Paginated<T>> {
  if (Config.features.mockData) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    return {
      rows: fallback.slice(start, start + pageSize),
      total: fallback.length,
      page,
      pageSize,
    };
  }

  const { data } = await http.get<Paginated<T>>(path, { params: query });
  return data;
}

export const recordsService = {
  endUsers: (q: ListQuery = {}) => list<EndUser>("/end-users", endUsers, q),
  cardholders: (q: ListQuery = {}) => list<Cardholder>("/cardholders", cardholders, q),
  cards: (q: ListQuery = {}) => list<Card>("/cards", cards, q),
  transactions: (q: ListQuery = {}) => list<Transaction>("/transactions", transactions, q),
  cardOrders: (q: ListQuery = {}) => list<CardOrder>("/card-orders", cardOrders, q),
  floatEntries: (q: ListQuery = {}) => list<FloatEntry>("/float/ledger", floatEntries, q),
  cryptoTxs: (q: ListQuery = {}) => list<CryptoTx>("/crypto-txs", cryptoTxs, q),
  webhooks: (q: ListQuery = {}) => list<WebhookEndpoint>("/webhooks", webhookEndpoints, q),
  apiKeys: (q: ListQuery = {}) => list<ApiKey>("/api-keys", apiKeys, q),
  auditLog: (q: ListQuery = {}) => list<AuditEvent>("/audit-log", auditEvents, q),

  /** CSV export — the API streams a file; mock mode builds it in the browser. */
  exportUrl(resource: string, query: ListQuery = {}): string {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value == null) return;
      params.set(key, Array.isArray(value) ? value.join(",") : String(value));
    });
    const qs = params.toString();
    return `${Config.api.baseUrl}/${resource}/export${qs ? `?${qs}` : ""}`;
  },
};

export default recordsService;
