"use client";

import { useMemo, useState } from "react";
import type { SortDir } from "@/types/global";
import { DEFAULT_PAGE_SIZE } from "@/types/constants";
import { sortBy } from "@/utils/helper";

interface Options<T> {
  rows: T[];
  /** fields scanned by the toolbar search box */
  searchFields: (row: T) => Array<string | number | null | undefined>;
  /** resolves a column key to the value it sorts by */
  sortValue: (row: T, key: string) => string | number | null | undefined;
  initialSort?: { key: string; dir: SortDir };
  pageSize?: number;
  /** extra predicate driven by the Filters popover */
  filter?: (row: T) => boolean;
}

export interface TableState<T> {
  query: string;
  setQuery: (value: string) => void;
  sort: { key: string; dir: SortDir } | null;
  toggleSort: (key: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  total: number;
  rangeFrom: number;
  rangeTo: number;
  pageRows: T[];
}

/**
 * Client-side search → filter → sort → paginate pipeline shared by every
 * listing table. Swap the body for server-driven paging when the API lands;
 * the surface stays identical.
 */
export default function useTableState<T>({
  rows,
  searchFields,
  sortValue,
  initialSort,
  pageSize: initialPageSize = DEFAULT_PAGE_SIZE,
  filter,
}: Options<T>): TableState<T> {
  const [query, setQueryRaw] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(
    initialSort ?? null
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeRaw] = useState(initialPageSize);

  const setQuery = (value: string) => {
    setQueryRaw(value);
    setPage(1);
  };

  const setPageSize = (size: number) => {
    setPageSizeRaw(size);
    setPage(1);
  };

  const toggleSort = (key: string) => {
    setSort((current) => {
      if (current?.key !== key) return { key, dir: "asc" };
      if (current.dir === "asc") return { key, dir: "desc" };
      return null;
    });
    setPage(1);
  };

  const processed = useMemo(() => {
    const needle = query.trim().toLowerCase();

    let out = rows;

    if (filter) out = out.filter(filter);

    if (needle) {
      out = out.filter((row) =>
        searchFields(row).some((field) =>
          field == null ? false : String(field).toLowerCase().includes(needle)
        )
      );
    }

    if (sort) {
      out = sortBy(out, (row) => sortValue(row, sort.key), sort.dir);
    }

    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, sort, filter]);

  const total = processed.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = processed.slice(start, start + pageSize);

  return {
    query,
    setQuery,
    sort,
    toggleSort,
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    total,
    rangeFrom: total === 0 ? 0 : start + 1,
    rangeTo: Math.min(start + pageSize, total),
    pageRows,
  };
}
