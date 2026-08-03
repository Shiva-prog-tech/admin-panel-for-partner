// ===========================================================================
// Audit log — owned by AuditLogModule.
//
// Two tables on one screen: machine API requests, and human admin activity.
// The status filter is a bucket ("2xx", "400", "401", "500") rather than an
// exact code, so it is translated here instead of in the component.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { apiRequests, matchesStatusBucket } from "@/mockData/apiAuditLog";
import { auditEvents } from "@/mockData/auditLog";
import type { Paginated } from "@/types/global";
import type { ApiRequestLog, AuditEvent } from "../types";

export const auditLogService = {
  apiRequests: (query: ListQuery = {}): Promise<Paginated<ApiRequestLog>> =>
    fetchList<ApiRequestLog>("/audit-log/api-requests", apiRequests, query, {
      searchFields: (row) => [row.path, row.method, row.refId, String(row.status)],
      // `filters.status` is a bucket ("2xx", "400", "401", "500"), and "2xx" /
      // "500" are ranges — so it cannot be expressed as a field match.
      predicate: (row, q) => matchesStatusBucket(row.status, q.filters?.status ?? ""),
      sortValue: (row, key) =>
        (row as unknown as Record<string, string | number>)[key] ?? null,
    }),

  adminActivity: (query: ListQuery = {}): Promise<Paginated<AuditEvent>> =>
    fetchList<AuditEvent>("/audit-log", auditEvents, query, {
      searchFields: (row) => [row.actor, row.action, row.target, row.ip],
      sortValue: (row, key) =>
        (row as unknown as Record<string, string | number>)[key] ?? null,
    }),

  exportCsv: (query: ListQuery = {}) => exportUrl("audit-log/api-requests", query),
};

export default auditLogService;
