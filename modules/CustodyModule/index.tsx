"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/Components/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker";
import StatCard from "@/Components/StatCard";
import DetailGrid from "@/Components/DetailGrid";
import TableCard from "@/Components/Table/Table_V2";
import SelectFilter from "@/Components/SelectFilter";
import ExportButton from "@/Components/ExportButton";
import RowMenu from "@/Components/RowMenu";
import CoinIcon from "@/Components/CoinIcon";
import Badge from "@/Components/Badge";
import Icon from "@/Components/Icons";
import useServerTable from "@/customHooks/useServerTable";
import custodyService from "./services/custodyService";
import useCopyToClipboard from "@/customHooks/useCopyToClipboard";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/ToastReducer";
import { CUSTODY_ASSET_OPTIONS, WITHDRAWAL_STATUS_OPTIONS } from "./constants";
import type { Column } from "@/types/global";
import type { CustodyWithdrawal, PoolBalance } from "./types";
import { buttonStyles } from "@/Components/Button";
import { panelStyles } from "@/Components/PanelCard";
import { tagStyles } from "@/Components/Tag";
import { listingStyles } from "@/Components/ListingPage";
import {
  custodyAssetTiles,
  custodyStats,
  feeSchedule,
} from "@/mockData/custody";
import { cx,
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
  const pools = useServerTable<PoolBalance>({
    fetcher: custodyService.poolBalances,
    filters: { asset: poolAsset },
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
    { key: "chain", header: "Chain", render: (row) => <span className={tagStyles.tag}>{row.chain}</span> },
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
  const withdrawals = useServerTable<CustodyWithdrawal>({
    fetcher: custodyService.withdrawals,
    filters: { asset: wdAsset, status: wdStatus },
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
    <div className={listingStyles.page}>
      <PageHeader
        title="Custody"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Custody" }]}
        subtitle={
          <>
            Client crypto balances held on your behalf ·{" "}
            <Link href="/crypto-txs" className={buttonStyles.linkBrand}>
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
      <div className={listingStyles.stats}>
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

      <section className={cx(panelStyles.card, panelStyles.divided, "u-mb-md")}>
        <div className={panelStyles.head}>
          <div>
            <h2 className={panelStyles.title}>Fee schedule</h2>
            <p className={panelStyles.sub}>Read-only — contact Swipeo to change</p>
          </div>
          <span className={tagStyles.tag}>
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

      <h2 className={panelStyles.sectionTitle}>Tenant pool balances</h2>
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

      <h2 className={panelStyles.sectionTitle}>Withdrawals</h2>
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

      <p className={listingStyles.note}>
        <Icon name="info" size={14} />
        {formatNumber(custodyStats.balances)} held balances across{" "}
        {custodyStats.chains} chains · {custodyStats.pendingWithdrawals} withdrawals
        awaiting settlement
      </p>
    </div>
  );
}
