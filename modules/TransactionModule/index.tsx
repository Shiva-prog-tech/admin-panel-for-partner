"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/Components/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker";
import StatCard from "@/Components/StatCard";
import TableCard from "@/Components/Table/Table_V2";
import SelectFilter from "@/Components/SelectFilter";
import RefCell from "@/Components/RefCell";
import RowMenu from "@/Components/RowMenu";
import ExportButton from "@/Components/ExportButton";
import Badge from "@/Components/Badge";
import useTableState from "@/customHooks/useTableState";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/ToastReducer";
import {
  TX_STATUS_BUCKETS,
  TX_STATUS_OPTIONS,
  TX_TYPE_OPTIONS,
} from "@/types/constants";
import type { Column, Transaction } from "@/types/global";
import { transactions, transactionStats } from "@/utils/mockData/transactions";
import { formatDateTimeNumeric, formatMoney, formatNumber, formatPercent } from "@/utils/helper";
import { listingStyles } from "@/Components/ListingPage";

export default function Transactions() {
  const dispatch = useAppDispatch();
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const filter = useMemo(() => {
    if (!type && !status) return undefined;
    // "Success" also covers rows the issuer reports as "Authorized".
    const allowed = status ? TX_STATUS_BUCKETS[status] ?? [status] : null;
    return (row: Transaction) =>
      (!type || row.type === type) && (!allowed || allowed.includes(row.status));
  }, [type, status]);

  const state = useTableState<Transaction>({
    rows: transactions,
    filter,
    searchFields: (row) => [row.refId, row.merchant, row.last4, row.status],
    sortValue: (row, key) =>
      (row as unknown as Record<string, string | number | null>)[key] ?? null,
  });

  const columns: Column<Transaction>[] = [
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => formatDateTimeNumeric(row.createdAt),
    },
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
    {
      key: "amount",
      header: "Amount",
      align: "right",
      sortable: true,
      render: (row) => (
        <span className="dt__strong">
          {formatMoney(row.amount, "")} {row.currency}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (row) => <span className="dt__mono">{row.type}</span>,
    },
    { key: "status", header: "Status", sortable: true, render: (row) => <Badge>{row.status}</Badge> },
    {
      key: "last4",
      header: "Last 4",
      align: "center",
      render: (row) =>
        row.last4 ? (
          <span className="dt__mono">{row.last4}</span>
        ) : (
          <span className="dt__muted">—</span>
        ),
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
                      text: `${row.merchant} · ${formatMoney(row.amount, "")} ${row.currency}`,
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
    <div className={listingStyles.page}>
      <PageHeader
        title="Card transactions"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Transactions" }]}
        subtitle="Spend and authorizations across all end users"
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="card-transactions.csv"
              rows={state.pageRows}
              columns={[
                { label: "Date", value: (r) => r.createdAt },
                { label: "Ref ID", value: (r) => r.refId },
                { label: "Merchant", value: (r) => r.merchant },
                { label: "Amount", value: (r) => r.amount },
                { label: "Currency", value: (r) => r.currency },
                { label: "Type", value: (r) => r.type },
                { label: "Status", value: (r) => r.status },
                { label: "Last 4", value: (r) => r.last4 },
              ]}
            />
          </>
        }
      />

      <div className={listingStyles.stats}>
        <StatCard variant="inline" icon="transactions" label="Transactions" value={formatNumber(transactionStats.total)} caption="This period" series={transactionStats.series.total} />
        <StatCard variant="inline" icon="wallet" label="Approved volume" value={`${formatMoney(transactionStats.approvedVolume, "")} AED`} caption="This period" series={transactionStats.series.volume} />
        <StatCard variant="inline" icon="ban" label="Failed" value={formatNumber(transactionStats.failed)} caption="This period" series={transactionStats.series.failed} />
        <StatCard variant="inline" icon="checkCircle" label="Approval rate" value={formatPercent(transactionStats.approvalRate)} caption="This period" series={transactionStats.series.approval} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1320}
        searchPlaceholder="Search merchant, ref ID, card..."
        unit="transactions"
        toolbarRight={
          <>
            <SelectFilter
              label="Transaction type"
              value={type}
              onChange={setType}
              options={TX_TYPE_OPTIONS}
            />
            <SelectFilter
              label="Transaction status"
              value={status}
              onChange={setStatus}
              options={TX_STATUS_OPTIONS}
            />
          </>
        }
      />
    </div>
  );
}
