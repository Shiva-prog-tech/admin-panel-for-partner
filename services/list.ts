// ===========================================================================
// Shared paginated-list helper.
//
// Not a domain service — every module service is a thin wrapper over this, so
// the mock/live switch and the pagination contract are declared exactly once.
// Named without the `.service.ts` suffix to keep that distinction visible.
// ===========================================================================
import http from "@/utils/axios";
import { Config } from "@/utils/Config";
import type { Paginated } from "@/types/global";

export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string[];
  from?: string;
  to?: string;
}

/**
 * Returns a page of `fallback` while NEXT_PUBLIC_ENABLE_MOCK_DATA is on, and
 * hits `path` on the partner API once it is off. Module services call this
 * rather than touching axios, so no component ever imports an HTTP client.
 */
export async function fetchList<T>(
  path: string,
  fallback: T[],
  query: ListQuery = {}
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

/** CSV export URL — the API streams the file. */
export function exportUrl(resource: string, query: ListQuery = {}): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value == null) return;
    params.set(key, Array.isArray(value) ? value.join(",") : String(value));
  });
  const qs = params.toString();
  return `${Config.api.baseUrl}/${resource}/export${qs ? `?${qs}` : ""}`;
}
