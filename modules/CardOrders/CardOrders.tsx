"use client";

import { useMemo } from "react";
import PageHeader from "@/Components/PageHeader/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker/DateRangePicker";
import StatCard from "@/Components/StatCard/StatCard";
import TableCard from "@/Components/Table/TableCard";
import RefCell from "@/Components/Table/RefCell";
import RowMenu from "@/Components/Table/RowMenu";
import FilterMenu from "@/Components/Table/FilterMenu";
import ExportButton from "@/Components/Table/ExportButton";
import Badge from "@/Components/Badge/Badge";
import useTableState from "@/customHooks/useTableState";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearFilters, selectStatuses, toggleStatus } from "@/redux/reducers/filtersSlice";
import { pushToast } from "@/redux/reducers/toastSlice";
import type { CardOrder, Column } from "@/types/global";
import { cardOrders as seededOrders, cardOrderStats } from "@/utils/mockData/cardOrders";
import { formatDateTimeNumeric, formatNumber, truncateMiddle } from "@/utils/helper";

const RESOURCE = "cardOrders";
const STATUSES = ["Delivered", "Shipped", "In production", "Requested", "Cancelled"] as const;

export default function CardOrders() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectStatuses(RESOURCE));

  const filter = useMemo(() => {
    if (!selected.length) return undefined;
    return (row: CardOrder) => selected.includes(row.status);
  }, [selected]);

  const state = useTableState<CardOrder>({
    rows: seededOrders,
    filter,
    searchFields: (row) => [row.refId, row.cardholderRef, row.product, row.destination, row.status],
    sortValue: (row, key) => (row as unknown as Record<string, string | number>)[key] ?? null,
  });

  const columns: Column<CardOrder>[] = [
    { key: "refId", header: "Ref ID", sortable: true, render: (row) => <RefCell value={row.refId} /> },
    {
      key: "cardholderRef",
      header: "Cardholder",
      render: (row) => (
        <span className="dt__mono" title={row.cardholderRef}>
          {truncateMiddle(row.cardholderRef, 8, 6)}
        </span>
      ),
    },
    { key: "product", header: "Product", sortable: true, render: (row) => <span className="dt__strong">{row.product}</span> },
    { key: "quantity", header: "Qty", align: "center", sortable: true, render: (row) => row.quantity },
    { key: "destination", header: "Destination", sortable: true, render: (row) => row.destination },
    { key: "status", header: "Status", sortable: true, render: (row) => <Badge>{row.status}</Badge> },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => formatDateTimeNumeric(row.createdAt),
    },
    {
      key: "action",
      header: "Action",
      align: "right",
      headerClassName: "dt__action",
      cellClassName: "dt__action",
      render: (row) => (
        <span className="dt__action-inner">
          <RowMenu
            actions={[
              {
                label: "Track shipment",
                icon: "external",
                onSelect: () =>
                  dispatch(pushToast({ tone: "info", title: "Tracking", text: row.destination })),
              },
              {
                label: "Reprint order",
                icon: "refresh",
                onSelect: () =>
                  dispatch(pushToast({ tone: "success", title: "Reprint queued", text: row.refId })),
              },
              {
                label: "Cancel order",
                icon: "ban",
                danger: true,
                onSelect: () =>
                  dispatch(pushToast({ tone: "info", title: "Order cancelled", text: row.refId })),
              },
            ]}
          />
        </span>
      ),
    },
  ];

  return (
    <div className="listing">
      <PageHeader
        title="Card orders"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Card orders" }]}
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="card-orders.csv"
              rows={state.pageRows}
              columns={[
                { label: "Ref ID", value: (r) => r.refId },
                { label: "Cardholder", value: (r) => r.cardholderRef },
                { label: "Product", value: (r) => r.product },
                { label: "Quantity", value: (r) => r.quantity },
                { label: "Destination", value: (r) => r.destination },
                { label: "Status", value: (r) => r.status },
                { label: "Created", value: (r) => r.createdAt },
              ]}
            />
          </>
        }
      />

      <div className="stat-grid listing__stats">
        <StatCard variant="inline" icon="package" label="Total orders" value={formatNumber(cardOrderStats.total)} caption="All time" series={cardOrderStats.series.total} />
        <StatCard variant="inline" icon="checkCircle" label="Delivered" value={formatNumber(cardOrderStats.delivered)} caption="All time" series={cardOrderStats.series.delivered} />
        <StatCard variant="inline" icon="send" label="In transit" value={formatNumber(cardOrderStats.inTransit)} caption="Right now" series={cardOrderStats.series.transit} />
        <StatCard variant="inline" icon="clock" label="Awaiting production" value={formatNumber(cardOrderStats.pending)} caption="Right now" series={cardOrderStats.series.pending} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1160}
        searchPlaceholder="Search ref ID or destination..."
        unit="orders"
        toolbarRight={
          <FilterMenu
            options={STATUSES}
            selected={selected}
            showCaret
            onToggle={(status) => dispatch(toggleStatus({ resource: RESOURCE, status }))}
            onClear={() => dispatch(clearFilters(RESOURCE))}
          />
        }
      />
    </div>
  );
}
