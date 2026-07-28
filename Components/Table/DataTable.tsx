"use client";

import Icon from "@/Components/Icons/Icon";
import type { Column, SortDir } from "@/types/global";
import { cx } from "@/utils/helper";

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  sort?: { key: string; dir: SortDir } | null;
  onSort?: (key: string) => void;
  minWidth?: number;
  emptyTitle?: string;
  emptyText?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  sort,
  onSort,
  minWidth = 900,
  emptyTitle = "Nothing to show",
  emptyText = "Try clearing the search box or widening the date range.",
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="table-scroll">
        <div className="empty-state">
          <span className="empty-state__icon">
            <Icon name="search" size={22} />
          </span>
          <div className="empty-state__title">{emptyTitle}</div>
          <p className="empty-state__text">{emptyText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="dt" style={{ minWidth }}>
        <thead>
          <tr>
            {columns.map((column) => {
              const sortable = Boolean(column.sortable && onSort);
              const active = sort?.key === column.key;

              return (
                <th
                  key={column.key}
                  scope="col"
                  style={{ width: column.width, textAlign: column.align ?? "left" }}
                  className={cx(
                    sortable && "dt__sortable",
                    column.align === "right" && "dt__num",
                    column.align === "center" && "dt__center",
                    column.headerClassName
                  )}
                  onClick={sortable ? () => onSort?.(column.key) : undefined}
                  aria-sort={
                    active ? (sort?.dir === "asc" ? "ascending" : "descending") : undefined
                  }
                >
                  {sortable ? (
                    <span
                      style={{
                        justifyContent:
                          column.align === "right"
                            ? "flex-end"
                            : column.align === "center"
                              ? "center"
                              : "flex-start",
                      }}
                    >
                      {column.header}
                      <span className={cx("dt__sort", active && "dt__sort--active")}>
                        <Icon
                          name={
                            active
                              ? sort?.dir === "asc"
                                ? "chevronUp"
                                : "chevronDown"
                              : "chevronsUpDown"
                          }
                          size={13}
                          strokeWidth={2}
                        />
                      </span>
                    </span>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{ textAlign: column.align ?? "left" }}
                  className={cx(
                    column.align === "right" && "dt__num",
                    column.align === "center" && "dt__center",
                    column.cellClassName
                  )}
                >
                  {column.render
                    ? column.render(row, rowIndex)
                    : String((row as Record<string, unknown>)[column.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
