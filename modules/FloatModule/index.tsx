"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/Components/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker";
import StatCard from "@/Components/StatCard";
import TableCard from "@/Components/Table/Table_V2";
import SelectFilter from "@/Components/SelectFilter";
import ExportButton from "@/Components/ExportButton";
import AreaChart from "@/Components/Charts/AreaChart";
import Badge from "@/Components/Badge";
import ConvertCard from "./components/ConvertCard";
import useServerTable from "@/customHooks/useServerTable";
import floatService from "./services/floatService";
import { useAppSelector } from "@/redux/hooks";
import { DIRECTION_OPTIONS } from "@/types/constants";
import { JOURNAL_REASON_OPTIONS } from "./constants";
import type { Column } from "@/types/global";
import type { JournalEntry } from "./types";
import { floatSummary } from "@/mockData/dashboard";
import { floatStats } from "@/mockData/floatLedger";
import { custodySummaryLine } from "@/mockData/custody";
import { panelStyles } from "@/Components/PanelCard";
import { listingStyles } from "@/Components/ListingPage";
import styles from "./FloatModule.module.scss";
import { cx,
  formatDateTimeNumeric,
  formatMoney,
  formatMoneyPlain,
  smoothSeries,
} from "@/utils/helper";

export default function Float() {
  const tenant = useAppSelector((state) => state.config.tenant);

  const [direction, setDirection] = useState("");
  const [reason, setReason] = useState("");

  const state = useServerTable<JournalEntry>({
    fetcher: floatService.journal,
    filters: { direction, reason },
  });

  const columns: Column<JournalEntry>[] = [
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => formatDateTimeNumeric(row.createdAt),
    },
    {
      key: "direction",
      header: "Direction",
      sortable: true,
      render: (row) => (
        <Badge tone={row.direction === "credit" ? "success" : "neutral"}>
          {row.direction}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      sortable: true,
      render: (row) => (
        <span
          className="dt__strong"
          style={{ color: row.direction === "credit" ? "var(--green-text)" : undefined }}
        >
          {row.amount.toFixed(2)} USD
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
      key: "reference",
      header: "Reference",
      render: (row) =>
        row.reference ? (
          <span
            className={row.reason === "card_topup_refund" ? "dt__reason" : undefined}
            style={
              row.reason === "card_topup_refund" ? undefined : { color: "var(--text-secondary)" }
            }
          >
            {row.reference}
          </span>
        ) : (
          <span className="dt__muted">—</span>
        ),
    },
  ];

  return (
    <div className={listingStyles.page}>
      <PageHeader
        title="Float ledger"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Float" }]}
        subtitle="Prefunded USD balance used for card issuance and top-ups"
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="float-journal.csv"
              rows={state.pageRows}
              columns={[
                { label: "Date", value: (r) => r.createdAt },
                { label: "Direction", value: (r) => r.direction },
                { label: "Amount", value: (r) => r.amount },
                { label: "Currency", value: () => "USD" },
                { label: "Reason", value: (r) => r.reason },
                { label: "Reference", value: (r) => r.reference },
              ]}
            />
          </>
        }
      />

      <div className={styles.tiles}>
        <StatCard
          variant="inline"
          icon="wallet"
          label="USD float balance"
          value={formatMoneyPlain(floatStats.balance)}
          caption={floatStats.status}
          series={smoothSeries("float-balance", 26)}
        />
        <StatCard
          variant="inline"
          icon="custody"
          label="Custody (all assets)"
          value={custodySummaryLine}
          valueScale="xs"
          caption={`${floatStats.entries} journal entries this period`}
        />
        <StatCard
          variant="inline"
          icon="globe"
          label="Environment"
          value={tenant.mode}
          caption={tenant.environmentLabel}
        />
      </div>

      <ConvertCard />

      <section className={cx(panelStyles.card, "u-mb-md")}>
        <div className={panelStyles.head} style={{ paddingBottom: 0 }}>
          <div>
            <h2 className={panelStyles.title}>Balance trend</h2>
            <p className={panelStyles.sub}>
              Closing balance per day, {floatSummary.currency}
            </p>
          </div>
          <Badge tone="success" uppercase>
            {floatStats.status.toUpperCase()}
          </Badge>
        </div>

        <AreaChart points={floatSummary.series} height={240} />
      </section>

      <h2 className={panelStyles.sectionTitle}>Journal entries</h2>
      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1120}
        searchPlaceholder="Search reference, reason..."
        unit="entries"
        toolbarRight={
          <>
            <SelectFilter
              label="Direction"
              value={direction}
              onChange={setDirection}
              options={DIRECTION_OPTIONS}
            />
            <SelectFilter
              label="Reason"
              value={reason}
              onChange={setReason}
              options={JOURNAL_REASON_OPTIONS}
            />
          </>
        }
      />
    </div>
  );
}
