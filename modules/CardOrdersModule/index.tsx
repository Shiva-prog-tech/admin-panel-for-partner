"use client";

import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker";
import StatCard from "@/Components/StatCard";
import TableCard from "@/Components/Table/Table_V2";
import SelectFilter from "@/Components/SelectFilter";
import RefCell from "@/Components/RefCell";
import RowMenu from "@/Components/RowMenu";
import ExportButton from "@/Components/ExportButton";
import Badge from "@/Components/Badge";
import useServerTable from "@/customHooks/useServerTable";
import cardOrdersService from "./services/cardOrdersService";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/ToastReducer";
import { CARD_ORDER_STATUSES } from "./constants";
import type { Column, SelectOption } from "@/types/global";
import type { CardOrder } from "./types";
import { cardOrderStats } from "@/mockData/cardOrders";
import { formatDateTimeNumeric, formatNumber } from "@/utils/helper";
import { listingStyles } from "@/Components/ListingPage";

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All statuses" },
  ...CARD_ORDER_STATUSES.map((status) => ({ value: status, label: status })),
];

export default function CardOrders() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("");

  const state = useServerTable<CardOrder>({
    fetcher: cardOrdersService.list,
    filters: { status },
  });

  const columns: Column<CardOrder>[] = [
    {
      key: "order",
      header: "Order",
      sortable: true,
      render: (row) => <span className="dt__mono dt__strong">{row.order}</span>,
    },
    {
      key: "refId",
      header: "Ref ID",
      sortable: true,
      render: (row) => <RefCell value={row.refId} />,
    },
    { key: "status", header: "Status", sortable: true, render: (row) => <Badge>{row.status}</Badge> },
    { key: "recipient", header: "Recipient", render: (row) => row.recipient },
    { key: "country", header: "Country", render: (row) => row.country },
    {
      key: "tracking",
      header: "Tracking",
      render: (row) =>
        row.tracking ? (
          <span className="dt__mono">{row.tracking}</span>
        ) : (
          <span className="dt__muted">—</span>
        ),
    },
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
                  dispatch(
                    pushToast({
                      tone: row.tracking ? "info" : "error",
                      title: row.tracking ? "Tracking" : "Not shipped yet",
                      text: row.tracking ?? row.country,
                    })
                  ),
              },
              {
                label: "Reprint order",
                icon: "refresh",
                onSelect: () =>
                  dispatch(pushToast({ tone: "success", title: "Reprint queued", text: row.order })),
              },
              {
                label: "Cancel order",
                icon: "ban",
                danger: true,
                onSelect: () =>
                  dispatch(pushToast({ tone: "info", title: "Order cancelled", text: row.order })),
              },
            ]}
          />
        </span>
      ),
    },
  ];

  return (
    <div className={listingStyles.page}>
      <PageHeader
        title="Physical card orders"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Card orders" }]}
        subtitle="Plastic fulfilment and courier tracking"
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="physical-card-orders.csv"
              rows={state.pageRows}
              columns={[
                { label: "Order", value: (r) => r.order },
                { label: "Ref ID", value: (r) => r.refId },
                { label: "Status", value: (r) => r.status },
                { label: "Recipient", value: (r) => r.recipient },
                { label: "Country", value: (r) => r.country },
                { label: "Tracking", value: (r) => r.tracking },
                { label: "Created", value: (r) => r.createdAt },
              ]}
            />
          </>
        }
      />

      <div className={listingStyles.stats}>
        <StatCard variant="inline" icon="package" label="Total orders" value={formatNumber(cardOrderStats.total)} caption="All time" series={cardOrderStats.series.total} />
        <StatCard variant="inline" icon="checkCircle" label="Delivered" value={formatNumber(cardOrderStats.delivered)} caption="All time" series={cardOrderStats.series.delivered} />
        <StatCard variant="inline" icon="send" label="Shipped" value={formatNumber(cardOrderStats.shipped)} caption="In transit" series={cardOrderStats.series.shipped} />
        <StatCard variant="inline" icon="clock" label="Pending" value={formatNumber(cardOrderStats.pending)} caption="Awaiting production" series={cardOrderStats.series.pending} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1320}
        searchPlaceholder="Search ref ID, recipient..."
        unit="orders"
        emptyTitle="No results"
        emptyText="No physical card orders match the current status filter."
        toolbarRight={
          <SelectFilter
            label="Order status"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
          />
        }
      />
    </div>
  );
}
