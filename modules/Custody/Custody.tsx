"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/Components/PageHeader/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker/DateRangePicker";
import StatCard from "@/Components/StatCard/StatCard";
import DetailGrid from "@/Components/DetailGrid/DetailGrid";
import TableCard from "@/Components/Table/TableCard";
import SelectFilter from "@/Components/Table/SelectFilter";
import ExportButton from "@/Components/Table/ExportButton";
import RowMenu from "@/Components/Table/RowMenu";
import CoinIcon from "@/Components/Badge/CoinIcon";
import Badge from "@/Components/Badge/Badge";
import Icon from "@/Components/Icons/Icon";
import useTableState from "@/customHooks/useTableState";
import useCopyToClipboard from "@/customHooks/useCopyToClipboard";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/toastSlice";
import {
  CUSTODY_ASSET_OPTIONS,
  WITHDRAWAL_STATUS_OPTIONS,
} from "@/types/constants";
import type { Column, CustodyWithdrawal, PoolBalance } from "@/types/global";
import {
  custodyAssetTiles,
  custodyStats,
  custodyWithdrawals,
  feeSchedule,
  poolBalances,
} from "@/utils/mockData/custody";
import {
  formatDateTimeNumeric,
  formatNumber,
  smoothSeries,
  truncateMiddle,
} from "@/utils/helper";

export default function Custody() {
  const dispatch = useAppDispatch();
  const { copy } = useCopyToClipboard();

  const [poolAsset, setPoolAsset] = useState("");
  const [wdAsset, setWdAsset] = useState("");
  const [wdStatus, setWdStatus] = useState("");

  const copyAddress = async (address: string) => {
    await copy(address);
    dispatch(pushToast({ tone: "success", title: "Address copied", text: address }));
  };

  // --- tenant pool balances -------------------------------------------------
  const poolFilter = useMemo(() => {
    if (!poolAsset) return undefined;
    return (row: PoolBalance) => row.asset === poolAsset;
  }, [poolAsset]);

  const pools = useTableState<PoolBalance>({
    rows: poolBalances,
    filter: poolFilter,
    searchFields: (row) => [row.asset, row.chain],
    sortValue: (row, key) =>
      key === "balance"
        ? Number(row.balance)
        : (row as unknown as Record<string, string>)[key] ?? null,
  });

  const poolColumns: Column<PoolBalance>[] = [
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
    { key: "chain", header: "Chain", render: (row) => <span className="tag">{row.chain}</span> },
    {
      key: "balance",
      header: "Pool balance",
      align: "right",
      sortable: true,
      render: (row) => (
        <span className="dt__strong">
          {row.balance} {row.asset}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => formatDateTimeNumeric(row.updatedAt),
    },
  ];

  // --- withdrawals ---------------------------------------------------------
  const wdFilter = useMemo(() => {
    if (!wdAsset && !wdStatus) return undefined;
    return (row: CustodyWithdrawal) =>
      (!wdAsset || row.asset === wdAsset) && (!wdStatus || row.status === wdStatus);
  }, [wdAsset, wdStatus]);

  const withdrawals = useTableState<CustodyWithdrawal>({
    rows: custodyWithdrawals,
    filter: wdFilter,
    searchFields: (row) => [row.refId, row.asset, row.to, row.status],
    sortValue: (row, key) =>
      key === "amount"
        ? Number(row.amount)
        : (row as unknown as Record<string, string>)[key] ?? null,
  });

  const withdrawalColumns: Column<CustodyWithdrawal>[] = [
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
      render: (row) => <span className="dt__mono">{row.refId}</span>,
    },
    {
      key: "asset",
      header: "Asset",
      sortable: true,
      render: (row) => (
        <span className="u-row" style={{ gap: 8 }}>
          <CoinIcon symbol={row.asset} size={20} />
          <span>{row.asset}</span>
        </span>
      ),
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
    { key: "status", header: "Status", sortable: true, render: (row) => <Badge>{row.status}</Badge> },
    {
      key: "reason",
      header: "Reason",
      render: (row) =>
        row.reason ? (
          <span className="dt__reason">{row.reason}</span>
        ) : (
          <span className="dt__muted">—</span>
        ),
    },
    {
      key: "to",
      header: "To",
      render: (row) => (
        <button
          type="button"
          className="dt__mono dt__ref-id"
          title={row.to}
          onClick={() => copyAddress(row.to)}
        >
          {truncateMiddle(row.to, 10, 4)}
        </button>
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
                label: "Copy destination",
                icon: "copy",
                onSelect: () => copyAddress(row.to),
              },
              {
                label: "View on explorer",
                icon: "external",
                onSelect: () =>
                  dispatch(pushToast({ tone: "info", title: row.asset, text: row.to })),
              },
              {
                label: "Retry withdrawal",
                icon: "refresh",
                onSelect: () =>
                  dispatch(
                    pushToast({
                      tone: "success",
                      title: "Retry queued",
                      text: `${row.amount} ${row.asset}`,
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
        title="Custody"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Custody" }]}
        subtitle={
          <>
            Client crypto balances held on your behalf ·{" "}
            <Link href="/crypto-txs" className="link-brand" style={{ display: "inline-flex" }}>
              View all crypto transactions
            </Link>
          </>
        }
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="custody-pool-balances.csv"
              rows={pools.pageRows}
              columns={[
                { label: "Asset", value: (r) => r.asset },
                { label: "Chain", value: (r) => r.chain },
                { label: "Pool balance", value: (r) => r.balance },
                { label: "Updated", value: (r) => r.updatedAt },
              ]}
            />
          </>
        }
      />

      {/* held balances — one tile per asset/chain balance */}
      <div className="stat-grid listing__stats">
        {custodyAssetTiles.map((tile) => (
          <StatCard
            key={tile.id}
            variant="inline"
            icon="custody"
            label={tile.asset}
            value={`${tile.balance} ${tile.asset}`}
            valueScale="sm"
            caption={`${tile.clients} clients`}
            series={smoothSeries(`custody-${tile.id}`, 26)}
          />
        ))}
      </div>

      <section className="panel-card panel-card--divided u-mb-md">
        <div className="panel-card__head">
          <div>
            <h2 className="panel-card__title">Fee schedule</h2>
            <p className="panel-card__sub">Read-only — contact Swipeo to change</p>
          </div>
          <span className="tag">
            <Icon name="lock" size={13} />
          </span>
        </div>

        <DetailGrid
          columns={4}
          items={[
            { label: "Deposit", value: feeSchedule.deposit },
            { label: "Withdrawal", value: feeSchedule.withdrawal },
            { label: "Monthly", value: feeSchedule.monthly },
            { label: "Approval required", value: feeSchedule.approvalRequired },
          ]}
        />
      </section>

      <h2 className="section-title">Tenant pool balances</h2>
      <div className="u-mb-md">
        <TableCard
          state={pools}
          columns={poolColumns}
          rowKey={(row) => row.id}
          minWidth={820}
          searchPlaceholder="Filter by asset..."
          unit="balances"
          toolbarRight={
            <SelectFilter
              label="Asset"
              value={poolAsset}
              onChange={setPoolAsset}
              options={CUSTODY_ASSET_OPTIONS}
            />
          }
        />
      </div>

      <h2 className="section-title">Withdrawals</h2>
      <TableCard
        state={withdrawals}
        columns={withdrawalColumns}
        rowKey={(row) => row.id}
        minWidth={1240}
        searchPlaceholder="Search ref ID..."
        unit="withdrawals"
        toolbarRight={
          <>
            <SelectFilter
              label="Status"
              value={wdStatus}
              onChange={setWdStatus}
              options={WITHDRAWAL_STATUS_OPTIONS}
            />
            <SelectFilter
              label="Asset"
              value={wdAsset}
              onChange={setWdAsset}
              options={CUSTODY_ASSET_OPTIONS}
            />
          </>
        }
      />

      <p className="listing__note">
        <Icon name="info" size={14} />
        {formatNumber(custodyStats.balances)} held balances across{" "}
        {custodyStats.chains} chains · {custodyStats.pendingWithdrawals} withdrawals
        awaiting settlement
      </p>
    </div>
  );
}
