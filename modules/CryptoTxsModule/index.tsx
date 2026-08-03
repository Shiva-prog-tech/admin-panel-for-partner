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
import CoinIcon from "@/Components/CoinIcon";
import Badge from "@/Components/Badge";
import useServerTable from "@/customHooks/useServerTable";
import cryptoTxsService from "./services/cryptoTxsService";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/ToastReducer";
import { DIRECTION_OPTIONS } from "@/types/constants";
import { CRYPTO_ASSET_OPTIONS, CRYPTO_REASON_OPTIONS } from "./constants";
import type { Column } from "@/types/global";
import type { CryptoTx } from "./types";
import { cryptoStats } from "@/mockData/cryptoTxs";
import { explorerLink } from "@/utils/coins";
import { formatDateTimeNumeric, formatNumber, truncateMiddle } from "@/utils/helper";
import { tagStyles } from "@/Components/Tag";
import { listingStyles } from "@/Components/ListingPage";

/** utils/coins keys explorers by display name, the API by chain slug. */
const CHAIN_NETWORKS: Record<string, string> = {
  tron: "TRON",
  eth: "Ethereum",
  polygon: "Polygon",
  bsc: "BSC",
};

export default function CryptoTxs() {
  const dispatch = useAppDispatch();

  const [asset, setAsset] = useState("");
  const [dir, setDir] = useState("");
  const [reason, setReason] = useState("");

  const state = useServerTable<CryptoTx>({
    fetcher: cryptoTxsService.list,
    filters: { asset, dir, reason },
  });

  const columns: Column<CryptoTx>[] = [
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
      render: (row) =>
        row.refId === "_pool" ? (
          <span className="dt__mono dt__muted" title="Tenant pool movement">
            _pool
          </span>
        ) : (
          <RefCell value={row.refId} />
        ),
    },
    {
      key: "dir",
      header: "Dir",
      sortable: true,
      render: (row) => (
        <Badge tone={row.dir === "credit" ? "success" : "neutral"}>{row.dir}</Badge>
      ),
    },
    {
      key: "asset",
      header: "Asset",
      sortable: true,
      render: (row) => (
        <span className="u-row" style={{ gap: 8 }}>
          <CoinIcon symbol={row.asset} size={20} />
          <span className="dt__strong">{row.asset}</span>
        </span>
      ),
    },
    {
      key: "chain",
      header: "Chain",
      render: (row) => <span className={tagStyles.tag}>{row.chain}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      sortable: true,
      render: (row) => (
        <span className="dt__strong">
          {row.amount} {row.asset}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      sortable: true,
      render: (row) => <span className="dt__mono">{row.reason}</span>,
    },
    {
      key: "txHash",
      header: "Tx hash",
      render: (row) =>
        row.txHash ? (
          <RefCell value={row.txHash} truncate={{ head: 12, tail: 0 }} />
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
                label: "Open in explorer",
                icon: "external",
                onSelect: () => {
                  const network = CHAIN_NETWORKS[row.chain] ?? row.chain;
                  const url = row.txHash ? explorerLink(network, row.txHash) : null;
                  if (url) window.open(url, "_blank", "noopener,noreferrer");
                  else
                    dispatch(
                      pushToast({
                        tone: "info",
                        title: "No on-chain hash",
                        text: "Internal pool movements are book entries only.",
                      })
                    );
                },
              },
              {
                label: "Copy amount",
                icon: "copy",
                onSelect: () =>
                  dispatch(
                    pushToast({
                      tone: "success",
                      title: "Copied",
                      text: `${row.amount} ${row.asset}`,
                    })
                  ),
              },
              {
                label: "Re-check status",
                icon: "refresh",
                onSelect: () =>
                  dispatch(
                    pushToast({ tone: "info", title: "Re-checking", text: row.chain })
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
        title="Crypto transactions"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Crypto txs" }]}
        subtitle="Deposits, withdrawals, settlements across custody"
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="crypto-transactions.csv"
              rows={state.pageRows}
              columns={[
                { label: "Date", value: (r) => r.createdAt },
                { label: "Ref ID", value: (r) => r.refId },
                { label: "Direction", value: (r) => r.dir },
                { label: "Asset", value: (r) => r.asset },
                { label: "Chain", value: (r) => r.chain },
                { label: "Amount", value: (r) => r.amount },
                { label: "Reason", value: (r) => r.reason },
                { label: "Tx hash", value: (r) => r.txHash },
              ]}
            />
          </>
        }
      />

      <div className={listingStyles.stats}>
        <StatCard variant="inline" icon="crypto" label="Crypto txs" value={formatNumber(cryptoStats.total)} caption="This period" series={cryptoStats.series.total} />
        <StatCard variant="inline" icon="arrowDown" label="Deposits" value={formatNumber(cryptoStats.deposits)} caption="This period" series={cryptoStats.series.deposits} />
        <StatCard variant="inline" icon="transactions" label="Settlements" value={formatNumber(cryptoStats.settlements)} caption="Pool → float" series={cryptoStats.series.settlements} />
        <StatCard variant="inline" icon="arrowUp" label="Withdrawals" value={formatNumber(cryptoStats.withdrawals)} caption="This period" series={cryptoStats.series.withdrawals} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1380}
        searchPlaceholder="Search ref ID, tx hash..."
        unit="transactions"
        toolbarRight={
          <>
            <SelectFilter
              label="Asset"
              value={asset}
              onChange={setAsset}
              options={CRYPTO_ASSET_OPTIONS}
            />
            <SelectFilter
              label="Direction"
              value={dir}
              onChange={setDir}
              options={DIRECTION_OPTIONS}
            />
            <SelectFilter
              label="Reason"
              value={reason}
              onChange={setReason}
              options={CRYPTO_REASON_OPTIONS}
            />
          </>
        }
      />
    </div>
  );
}
