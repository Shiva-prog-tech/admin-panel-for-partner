"use client";

import type { ReactNode } from "react";
import DataTable from "./index";
import SearchField from "@/Components/SearchField";
import PerPageSelect from "@/Components/PerPageSelect";
import Pagination from "@/Components/Pagination";
import type { Column, TableState } from "@/types/global";
import { formatNumber } from "@/utils/helper";
import styles from "./Table.module.scss";

interface TableCardProps<T> {
  /**
   * Accepts the extra fields `useServerTable` adds on top of `TableState`, so a
   * table can tell "still fetching" apart from "genuinely empty".
   */
  state: TableState<T> & { loading?: boolean; error?: string | null };
  columns: Column<T>[];
  rowKey: (row: T) => string;
  searchPlaceholder?: string;
  /** buttons on the right of the toolbar (Filters, primary action …) */
  toolbarRight?: ReactNode;
  /** extra controls next to the search box */
  toolbarLeft?: ReactNode;
  minWidth?: number;
  emptyTitle?: string;
  emptyText?: string;
  /** noun used in "Showing 1 to 10 of 103 results" */
  unit?: string;
}

/**
 * The full listing shell: toolbar → scrollable table → footer with the result
 * counter, page-size select and pager. Every resource page composes this.
 */
export default function TableCard<T>({
  state,
  columns,
  rowKey,
  searchPlaceholder = "Search ref ID...",
  toolbarRight,
  toolbarLeft,
  minWidth,
  emptyTitle,
  emptyText,
  unit = "results",
}: TableCardProps<T>) {
  // Every table is service-driven, so the first paint has no rows yet. Without
  // these the empty state claims "nothing to show" while the request is still in
  // flight — imperceptible against the fixtures, but a lie against a real API,
  // where it would read as a broken screen for the whole round trip.
  const failed = Boolean(state.error);
  const pending = Boolean(state.loading) && state.pageRows.length === 0;

  return (
    <section className={styles.shell} aria-busy={pending || undefined}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <SearchField
            value={state.query}
            onChange={state.setQuery}
            placeholder={searchPlaceholder}
          />
          {toolbarLeft}
        </div>

        {toolbarRight && <div className={styles.toolbarRight}>{toolbarRight}</div>}
      </div>

      <DataTable
        columns={columns}
        rows={state.pageRows}
        rowKey={rowKey}
        sort={state.sort}
        onSort={state.toggleSort}
        minWidth={minWidth}
        emptyTitle={
          failed ? "Could not load this list" : pending ? "Loading…" : emptyTitle
        }
        emptyText={
          failed
            ? (state.error as string)
            : pending
              ? "Fetching results from the partner API."
              : emptyText
        }
      />

      <div className={styles.footer}>
        <p className={styles.count}>
          Showing {formatNumber(state.rangeFrom)} to {formatNumber(state.rangeTo)} of{" "}
          {formatNumber(state.total)} {unit}
        </p>

        <div className={styles.footerRight}>
          <PerPageSelect value={state.pageSize} onChange={state.setPageSize} />
          <Pagination
            page={state.page}
            totalPages={state.totalPages}
            onChange={state.setPage}
          />
        </div>
      </div>
    </section>
  );
}
