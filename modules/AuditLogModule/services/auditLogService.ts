// ===========================================================================
// Audit log — owned by AuditLogModule.
//
// Two tables on one screen: machine API requests, and human admin activity.
// The status filter is a bucket ("2xx", "400", "401", "500") rather than an
// exact code, so it is translated here instead of in the component.
// ===========================================================================
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { apiRequests, matchesStatusBucket } from "@/utils/mockData/apiAuditLog";
import { auditEvents } from "@/utils/mockData/auditLog";
import { Config } from "@/utils/Config";
import type { ApiRequestLog, AuditEvent, Paginated } from "@/types/global";

export interface ApiRequestQuery extends ListQuery {
  /** "" | "2xx" | "400" | "401" | "500" */
  statusBucket?: string;
}

export const auditLogService = {
  async apiRequests(
    query: ApiRequestQuery = {}
  ): Promise<Paginated<ApiRequestLog>> {
    const { statusBucket, ...rest } = query;

    // Mock mode filters locally; the API takes the bucket as a query param.
    if (Config.features.mockData) {
      const rows = statusBucket
        ? apiRequests.filter((r) => matchesStatusBucket(r.status, statusBucket))
        : apiRequests;
      return fetchList<ApiRequestLog>("/audit-log/api-requests", rows, rest);
    }

    return fetchList<ApiRequestLog>("/audit-log/api-requests", apiRequests, {
      ...rest,
      ...(statusBucket ? { status: [statusBucket] } : {}),
    });
  },

  adminActivity: (query: ListQuery = {}): Promise<Paginated<AuditEvent>> =>
    fetchList<AuditEvent>("/audit-log", auditEvents, query),

  exportCsv: (query: ListQuery = {}) => exportUrl("audit-log/api-requests", query),
};

export default auditLogService;
