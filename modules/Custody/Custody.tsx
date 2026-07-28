"use client";

import PageHeader from "@/Components/PageHeader/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker/DateRangePicker";
import StatCard from "@/Components/StatCard/StatCard";
import TableCard from "@/Components/Table/TableCard";
import ExportButton from "@/Components/Table/ExportButton";
import RowMenu from "@/Components/Table/RowMenu";
import CoinIcon from "@/Components/Badge/CoinIcon";
import Badge from "@/Components/Badge/Badge";
import Icon from "@/Components/Icons/Icon";
import useTableState from "@/customHooks/useTableState";
import useCopyToClipboard from "@/customHooks/useCopyToClipboard";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/toastSlice";
import type { Column } from "@/types/global";
import {
  custodyWallets,
  custodyStats,
  type CustodyWallet,
} from "@/utils/mockData/custody";
import {
  formatDateLong,
  formatMoney,
  formatNumber,
  smoothSeries,
  truncateMiddle,
} from "@/utils/helper";

export default function Custody() {
  const dispatch = useAppDispatch();
  const { copy } = useCopyToClipboard();

  const state = useTableState<CustodyWallet>({
    rows: custodyWallets,
    searchFields: (row) => [row.label, row.symbol, row.network, row.address],
    sortValue: (row, key) => (row as unknown as Record<string, string | number>)[key] ?? null,
  });

  const columns: Column<CustodyWallet>[] = [
    {
      key: "label",
      header: "Wallet",
      sortable: true,
      render: (row) => (
        <span className="u-row" style={{ gap: 10 }}>
          <CoinIcon symbol={row.symbol} size={24} />
          <span>
            <span className="dt__strong" style={{ display: "block" }}>
              {row.label}
            </span>
            <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
              {row.symbol} · {row.network}
            </span>
          </span>
        </span>
      ),
    },
    {
      key: "address",
      header: "Address",
      render: (row) => (
        <button
          type="button"
          className="dt__mono dt__ref-id"
          title={row.address}
          onClick={async () => {
            await copy(row.address);
            dispatch(
              pushToast({ tone: "success", title: "Address copied", text: row.address })
            );
          }}
        >
          {truncateMiddle(row.address, 10, 8)}
        </button>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      align: "right",
      sortable: true,
      render: (row) => <span className="dt__strong">{row.balance}</span>,
    },
    {
      key: "usdValue",
      header: "USD value",
      align: "right",
      sortable: true,
      render: (row) => formatMoney(row.usdValue),
    },
    {
      key: "state",
      header: "State",
      sortable: true,
      render: (row) => <Badge tone={row.state === "Active" ? "success" : "info"}>{row.state}</Badge>,
    },
    {
      key: "createdAt",
      header: "Opened",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => formatDateLong(row.createdAt),
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
                label: "View on explorer",
                icon: "external",
                onSelect: () =>
                  dispatch(
                    pushToast({ tone: "info", title: row.network, text: row.address })
                  ),
              },
              {
                label: "Sweep to treasury",
                icon: "send",
                onSelect: () =>
                  dispatch(
                    pushToast({
                      tone: "success",
                      title: "Sweep scheduled",
                      text: `${row.balance} ${row.symbol}`,
                    })
                  ),
              },
              {
                label: "Freeze wallet",
                icon: "snowflake",
                danger: true,
                onSelect: () =>
                  dispatch(pushToast({ tone: "info", title: "Wallet frozen", text: row.label })),
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
        title="Custody"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Custody" }]}
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="custody-wallets.csv"
              rows={state.pageRows}
              columns={[
                { label: "Wallet", value: (r) => r.label },
                { label: "Asset", value: (r) => r.symbol },
                { label: "Network", value: (r) => r.network },
                { label: "Address", value: (r) => r.address },
                { label: "Balance", value: (r) => r.balance },
                { label: "USD value", value: (r) => r.usdValue },
                { label: "State", value: (r) => r.state },
              ]}
            />
          </>
        }
      />

      <div className="stat-grid listing__stats">
        <StatCard variant="inline" icon="custody" label="Custody wallets" value={formatNumber(custodyStats.wallets)} caption="All networks" series={smoothSeries("cu-wallets", 26)} />
        <StatCard variant="inline" icon="wallet" label="Total value" value={formatMoney(custodyStats.totalUsd)} caption="Mark to market" series={smoothSeries("cu-value", 26)} />
        <StatCard variant="inline" icon="globe" label="Networks" value={formatNumber(custodyStats.networks)} caption="Connected" series={smoothSeries("cu-networks", 26)} />
        <StatCard variant="inline" icon="diamond" label="Assets" value={formatNumber(custodyStats.assets)} caption="Supported" series={smoothSeries("cu-assets", 26)} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1160}
        searchPlaceholder="Search wallet, asset or address..."
        unit="wallets"
        toolbarRight={
          <button
            type="button"
            className="btn btn--brand"
            onClick={() =>
              dispatch(
                pushToast({
                  tone: "info",
                  title: "New custody wallet",
                  text: "Pick a network to generate a deposit address.",
                })
              )
            }
          >
            <Icon name="plus" size={17} />
            <span>New wallet</span>
          </button>
        }
      />
    </div>
  );
}
