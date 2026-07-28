"use client";

import type { ReactNode } from "react";
import DataTable from "./DataTable";
import SearchField from "./SearchField";
import PerPageSelect from "./PerPageSelect";
import Pagination from "@/Components/Pagination/Pagination";
import type { Column } from "@/types/global";
import type { TableState } from "@/customHooks/useTableState";
import { formatNumber } from "@/utils/helper";

interface TableCardProps<T> {
  state: TableState<T>;
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
  return (
    <section className="table-shell">
      <div className="table-toolbar">
        <div className="table-toolbar__left">
          <SearchField
            value={state.query}
            onChange={state.setQuery}
            placeholder={searchPlaceholder}
          />
          {toolbarLeft}
        </div>

        {toolbarRight && <div className="table-toolbar__right">{toolbarRight}</div>}
      </div>

      <DataTable
        columns={columns}
        rows={state.pageRows}
        rowKey={rowKey}
        sort={state.sort}
        onSort={state.toggleSort}
        minWidth={minWidth}
        emptyTitle={emptyTitle}
        emptyText={emptyText}
      />

      <div className="table-footer">
        <p className="table-footer__count">
          Showing {formatNumber(state.rangeFrom)} to {formatNumber(state.rangeTo)} of{" "}
          {formatNumber(state.total)} {unit}
        </p>

        <div className="table-footer__right">
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
