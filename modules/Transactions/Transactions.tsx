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
import type { Column, Transaction } from "@/types/global";
import {
  transactions as seededTransactions,
  transactionStats,
} from "@/utils/mockData/transactions";
import { formatDateTimeNumeric, formatMoney, formatNumber, formatPercent } from "@/utils/helper";

const RESOURCE = "transactions";
const STATUSES = ["Settled", "Pending", "Declined", "Reversed"] as const;

export default function Transactions() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectStatuses(RESOURCE));

  const filter = useMemo(() => {
    if (!selected.length) return undefined;
    return (row: Transaction) => selected.includes(row.status);
  }, [selected]);

  const state = useTableState<Transaction>({
    rows: seededTransactions,
    filter,
    searchFields: (row) => [row.refId, row.merchant, row.cardLast4, row.status],
    sortValue: (row, key) => (row as unknown as Record<string, string | number>)[key] ?? null,
  });

  const columns: Column<Transaction>[] = [
    {
      key: "refId",
      header: "Ref ID",
      sortable: true,
      render: (row) => <RefCell value={row.refId} />,
    },
    {
      key: "merchant",
      header: "Merchant",
      sortable: true,
      render: (row) => <span className="dt__strong">{row.merchant}</span>,
    },
    { key: "mcc", header: "MCC", align: "center", render: (row) => <span className="dt__mono">{row.mcc}</span> },
    {
      key: "cardLast4",
      header: "Card",
      align: "center",
      render: (row) => <span className="dt__mono">•••• {row.cardLast4}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      sortable: true,
      render: (row) => <span className="dt__strong">{formatMoney(row.amount)}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <Badge>{row.status}</Badge>,
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
                label: "View transaction",
                icon: "eye",
                onSelect: () =>
                  dispatch(pushToast({ tone: "info", title: row.merchant, text: row.refId })),
              },
              {
                label: "Copy authorisation id",
                icon: "copy",
                onSelect: () =>
                  dispatch(pushToast({ tone: "success", title: "Copied", text: row.refId })),
              },
              {
                label: "Dispute",
                icon: "alert",
                danger: true,
                onSelect: () =>
                  dispatch(
                    pushToast({
                      tone: "info",
                      title: "Dispute started",
                      text: `${row.merchant} · ${formatMoney(row.amount)}`,
                    })
                  ),
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
        title="Transactions"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Transactions" }]}
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="card-transactions.csv"
              rows={state.pageRows}
              columns={[
                { label: "Ref ID", value: (r) => r.refId },
                { label: "Merchant", value: (r) => r.merchant },
                { label: "MCC", value: (r) => r.mcc },
                { label: "Card", value: (r) => r.cardLast4 },
                { label: "Amount", value: (r) => r.amount },
                { label: "Currency", value: (r) => r.currency },
                { label: "Status", value: (r) => r.status },
                { label: "Created", value: (r) => r.createdAt },
              ]}
            />
          </>
        }
      />

      <div className="stat-grid listing__stats">
        <StatCard variant="inline" icon="transactions" label="Transactions" value={formatNumber(transactionStats.total)} caption="This period" series={transactionStats.series.total} />
        <StatCard variant="inline" icon="wallet" label="Settled volume" value={formatMoney(transactionStats.settledVolume)} caption="This period" series={transactionStats.series.volume} />
        <StatCard variant="inline" icon="ban" label="Declined" value={formatNumber(transactionStats.declined)} caption="This period" series={transactionStats.series.declined} />
        <StatCard variant="inline" icon="checkCircle" label="Approval rate" value={formatPercent(transactionStats.approvalRate)} caption="This period" series={transactionStats.series.approval} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1140}
        searchPlaceholder="Search ref ID or merchant..."
        unit="transactions"
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
