"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Paginated, SortDir, TableState } from "@/types/global";
import type { ListQuery } from "@/services/list";
import { DEFAULT_PAGE_SIZE } from "@/types/constants";

interface Options<T> {
  /** the module service call, e.g. `endUsersService.list` */
  fetcher: (query: ListQuery) => Promise<Paginated<T>>;
  initialSort?: { key: string; dir: SortDir };
  pageSize?: number;
  /** status values selected in the Filters popover */
  status?: readonly string[];
  /** extra filter axes, e.g. `{ asset, dir, reason }` — "" means all */
  filters?: Record<string, string>;
  /** debounce for the search box, ms */
  debounce?: number;
}

export interface ServerTableState<T> extends TableState<T> {
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Table state driven by a module service: the search / sort / filter / page
 * pipeline runs in the service rather than in the browser, so a table only ever
 * holds the page it is showing.
 *
 * This replaced a client-side `useTableState` that filtered a fully-loaded
 * fixture. Every listing now uses this hook.
 */
export default function useServerTable<T>({
  fetcher,
  initialSort,
  pageSize: initialPageSize = DEFAULT_PAGE_SIZE,
  status,
  filters,
  debounce = 250,
}: Options<T>): ServerTableState<T> {
  const [query, setQueryRaw] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(
    initialSort ?? null
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeRaw] = useState(initialPageSize);

  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  // debounce the search box so typing does not fire a request per keystroke
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), debounce);
    return () => window.clearTimeout(timer);
  }, [query, debounce]);

  const statusKey = (status ?? []).join(",");
  // stable dependency for the extra axes
  const filterKey = JSON.stringify(filters ?? {});

  // Guards against an earlier slow response overwriting a later one.
  const latest = useRef(0);

  useEffect(() => {
    const ticket = ++latest.current;
    setLoading(true);

    fetcher({
      page,
      pageSize,
      search: debounced || undefined,
      status: statusKey ? statusKey.split(",") : undefined,
      filters,
      sortKey: sort?.key,
      sortDir: sort?.dir,
    })
      .then((result) => {
        if (ticket !== latest.current) return;
        setRows(result.rows);
        setTotal(result.total);
        setError(null);
      })
      .catch((err: { message?: string }) => {
        if (ticket !== latest.current) return;
        setRows([]);
        setTotal(0);
        setError(err?.message ?? "Could not load this list.");
      })
      .finally(() => {
        if (ticket === latest.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, debounced, statusKey, filterKey, sort?.key, sort?.dir, nonce]);

  const setQuery = useCallback((value: string) => {
    setQueryRaw(value);
    setPage(1);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeRaw(size);
    setPage(1);
  }, []);

  const toggleSort = useCallback((key: string) => {
    setSort((current) => {
      if (current?.key !== key) return { key, dir: "asc" };
      if (current.dir === "asc") return { key, dir: "desc" };
      return null;
    });
    setPage(1);
  }, []);

  // any filter change invalidates the current page
  useEffect(() => setPage(1), [statusKey, filterKey]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;

  return {
    query,
    setQuery,
    sort,
    toggleSort,
    page: Math.min(page, totalPages),
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    total,
    rangeFrom: total === 0 ? 0 : start + 1,
    rangeTo: Math.min(start + pageSize, total),
    pageRows: rows,
    loading,
    error,
    reload: () => setNonce((n) => n + 1),
  };
}
