// ===========================================================================
// Shared paginated-list helper.
//
// Not a domain service — every module service is a thin wrapper over this, so
// the mock/live switch and the pagination contract are declared exactly once.
// Named without the `.service.ts` suffix to keep that distinction visible.
//
// In mock mode the search / status / sort / page pipeline is applied to the
// in-memory fixture, so a service returns the same page the API would. That is
// what lets `useServerTable` replace the client-side `useTableState`.
// ===========================================================================
import http from "@/utils/axios";
import { Config } from "@/utils/Config";
import { sortBy } from "@/utils/helper";
import type { Paginated, SortDir } from "@/types/global";

export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string[];
  /**
   * Extra filter axes beyond status, e.g. `{ asset: "USDT", dir: "credit" }`.
   * Empty-string values mean "all" and are ignored, matching the dropdowns.
   */
  filters?: Record<string, string>;
  sortKey?: string;
  sortDir?: SortDir;
  from?: string;
  to?: string;
}

/**
 * How to apply a query to a fixture array. Only needed in mock mode — the real
 * API does this server-side, so live calls ignore it entirely.
 */
export interface MockShape<T> {
  /** fields the toolbar search box scans */
  searchFields?: (row: T) => Array<string | number | null | undefined>;
  /** resolves a column key to its sortable value */
  sortValue?: (row: T, key: string) => string | number | null | undefined;
  /** the field a status filter matches against */
  statusOf?: (row: T) => string;
  /** resolves each `query.filters` key to the row value it matches */
  filterFields?: Record<string, (row: T) => string>;
  /** anything the two above cannot express */
  predicate?: (row: T, query: ListQuery) => boolean;
}

/** Applies the query to a fixture array exactly as the API would. */
function applyQuery<T>(rows: T[], query: ListQuery, shape: MockShape<T>): T[] {
  let out = rows;

  if (query.status?.length && shape.statusOf) {
    const wanted = new Set(query.status);
    out = out.filter((row) => wanted.has(shape.statusOf!(row)));
  }

  if (query.filters && shape.filterFields) {
    for (const [key, value] of Object.entries(query.filters)) {
      if (!value) continue; // "" means all
      const field = shape.filterFields[key];
      if (field) out = out.filter((row) => field(row) === value);
    }
  }

  if (shape.predicate) {
    out = out.filter((row) => shape.predicate!(row, query));
  }

  const needle = query.search?.trim().toLowerCase();
  if (needle && shape.searchFields) {
    out = out.filter((row) =>
      shape.searchFields!(row).some((field) =>
        field == null ? false : String(field).toLowerCase().includes(needle)
      )
    );
  }

  if (query.sortKey && shape.sortValue) {
    out = sortBy(out, (row) => shape.sortValue!(row, query.sortKey!), query.sortDir ?? "asc");
  }

  return out;
}

/**
 * Returns a page of `fallback` while NEXT_PUBLIC_ENABLE_MOCK_DATA is on, and
 * hits `path` on the partner API once it is off. Module services call this
 * rather than touching axios, so no component ever imports an HTTP client.
 */
export async function fetchList<T>(
  path: string,
  fallback: T[],
  query: ListQuery = {},
  shape: MockShape<T> = {}
): Promise<Paginated<T>> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;

  if (Config.features.mockData) {
    const filtered = applyQuery(fallback, query, shape);
    const start = (page - 1) * pageSize;
    return {
      rows: filtered.slice(start, start + pageSize),
      total: filtered.length,
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
