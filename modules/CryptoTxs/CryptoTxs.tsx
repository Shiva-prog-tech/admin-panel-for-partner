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
import CoinIcon from "@/Components/Badge/CoinIcon";
import Badge from "@/Components/Badge/Badge";
import Icon from "@/Components/Icons/Icon";
import useTableState from "@/customHooks/useTableState";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearFilters, selectStatuses, toggleStatus } from "@/redux/reducers/filtersSlice";
import { pushToast } from "@/redux/reducers/toastSlice";
import type { Column, CryptoTx } from "@/types/global";
import { cryptoTxs as seededTxs, cryptoStats } from "@/utils/mockData/cryptoTxs";
import { explorerLink } from "@/utils/coins";
import { formatDateTimeNumeric, formatMoney, formatNumber } from "@/utils/helper";

const RESOURCE = "cryptoTxs";
const STATUSES = ["Confirmed", "Pending", "Failed"] as const;

export default function CryptoTxs() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectStatuses(RESOURCE));

  const filter = useMemo(() => {
    if (!selected.length) return undefined;
    return (row: CryptoTx) => selected.includes(row.status);
  }, [selected]);

  const state = useTableState<CryptoTx>({
    rows: seededTxs,
    filter,
    searchFields: (row) => [row.hash, row.asset, row.network, row.status],
    sortValue: (row, key) => (row as unknown as Record<string, string | number>)[key] ?? null,
  });

  const columns: Column<CryptoTx>[] = [
    {
      key: "hash",
      header: "Tx hash",
      sortable: true,
      render: (row) => <RefCell value={row.hash} truncate={{ head: 10, tail: 8 }} />,
    },
    {
      key: "asset",
      header: "Asset",
      sortable: true,
      render: (row) => (
        <span className="u-row" style={{ gap: 9 }}>
          <CoinIcon symbol={row.asset} size={22} />
          <span className="dt__strong">{row.asset}</span>
        </span>
      ),
    },
    { key: "network", header: "Network", sortable: true, render: (row) => row.network },
    {
      key: "direction",
      header: "Direction",
      align: "center",
      sortable: true,
      render: (row) => (
        <Badge tone={row.direction === "in" ? "success" : "neutral"}>
          {row.direction === "in" ? "Deposit" : "Withdrawal"}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (row) => <span className="dt__strong">{row.amount}</span>,
    },
    {
      key: "usdValue",
      header: "USD value",
      align: "right",
      sortable: true,
      render: (row) => formatMoney(row.usdValue),
    },
    {
      key: "confirmations",
      header: "Conf.",
      align: "center",
      sortable: true,
      render: (row) => row.confirmations,
    },
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
                label: "Open in explorer",
                icon: "external",
                onSelect: () => {
                  const url = explorerLink(row.network, row.hash);
                  if (url) window.open(url, "_blank", "noopener,noreferrer");
                  else
                    dispatch(
                      pushToast({
                        tone: "info",
                        title: "No explorer configured",
                        text: row.network,
                      })
                    );
                },
              },
              {
                label: "Re-check confirmations",
                icon: "refresh",
                onSelect: () =>
                  dispatch(
                    pushToast({
                      tone: "info",
                      title: "Re-checking",
                      text: `${row.confirmations} confirmations so far`,
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
        title="Crypto txs"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Crypto txs" }]}
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="crypto-transactions.csv"
              rows={state.pageRows}
              columns={[
                { label: "Hash", value: (r) => r.hash },
                { label: "Asset", value: (r) => r.asset },
                { label: "Network", value: (r) => r.network },
                { label: "Direction", value: (r) => r.direction },
                { label: "Amount", value: (r) => r.amount },
                { label: "USD value", value: (r) => r.usdValue },
                { label: "Confirmations", value: (r) => r.confirmations },
                { label: "Status", value: (r) => r.status },
                { label: "Created", value: (r) => r.createdAt },
              ]}
            />
          </>
        }
      />

      <div className="stat-grid listing__stats">
        <StatCard variant="inline" icon="crypto" label="Crypto txs" value={formatNumber(cryptoStats.total)} caption="This period" series={cryptoStats.series.total} />
        <StatCard variant="inline" icon="checkCircle" label="Confirmed" value={formatNumber(cryptoStats.confirmed)} caption="This period" series={cryptoStats.series.confirmed} />
        <StatCard variant="inline" icon="clock" label="Pending" value={formatNumber(cryptoStats.pending)} caption="Right now" series={cryptoStats.series.pending} />
        <StatCard variant="inline" icon="wallet" label="Inbound value" value={formatMoney(cryptoStats.inboundUsd)} caption="This period" series={cryptoStats.series.inbound} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1340}
        searchPlaceholder="Search hash, asset or network..."
        unit="transactions"
        toolbarRight={
          <>
            <FilterMenu
              options={STATUSES}
              selected={selected}
              showCaret
              onToggle={(status) => dispatch(toggleStatus({ resource: RESOURCE, status }))}
              onClear={() => dispatch(clearFilters(RESOURCE))}
            />
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() =>
                dispatch(
                  pushToast({ tone: "info", title: "Syncing", text: "Re-scanning all networks…" })
                )
              }
            >
              <Icon name="refresh" size={16} />
              <span>Sync</span>
            </button>
          </>
        }
      />
    </div>
  );
}
