"use client";

import PageHeader from "@/Components/PageHeader/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker/DateRangePicker";
import StatCard from "@/Components/StatCard/StatCard";
import TableCard from "@/Components/Table/TableCard";
import RefCell from "@/Components/Table/RefCell";
import ExportButton from "@/Components/Table/ExportButton";
import AreaChart from "@/Components/Charts/AreaChart";
import Badge from "@/Components/Badge/Badge";
import Icon from "@/Components/Icons/Icon";
import useTableState from "@/customHooks/useTableState";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/toastSlice";
import type { Column, FloatEntry } from "@/types/global";
import { floatSummary } from "@/utils/mockData/dashboard";
import { floatEntries, floatStats } from "@/utils/mockData/floatLedger";
import {
  formatDateTimeNumeric,
  formatMoney,
  formatMoneyPlain,
  formatNumber,
  smoothSeries,
} from "@/utils/helper";

export default function Float() {
  const dispatch = useAppDispatch();

  const state = useTableState<FloatEntry>({
    rows: floatEntries,
    searchFields: (row) => [row.refId, row.description, row.direction],
    sortValue: (row, key) => (row as unknown as Record<string, string | number>)[key] ?? null,
  });

  const columns: Column<FloatEntry>[] = [
    { key: "refId", header: "Entry", sortable: true, render: (row) => <RefCell value={row.refId} /> },
    {
      key: "description",
      header: "Description",
      sortable: true,
      render: (row) => <span className="dt__strong">{row.description}</span>,
    },
    {
      key: "direction",
      header: "Direction",
      align: "center",
      sortable: true,
      render: (row) => (
        <Badge tone={row.direction === "credit" ? "success" : "neutral"}>
          {row.direction === "credit" ? "Credit" : "Debit"}
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
          {row.direction === "credit" ? "+" : "−"}
          {formatMoney(row.amount)}
        </span>
      ),
    },
    {
      key: "balanceAfter",
      header: "Balance after",
      align: "right",
      sortable: true,
      render: (row) => formatMoney(row.balanceAfter),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => formatDateTimeNumeric(row.createdAt),
    },
  ];

  return (
    <div className="listing">
      <PageHeader
        title="Float"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Float" }]}
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="float-ledger.csv"
              rows={state.pageRows}
              columns={[
                { label: "Entry", value: (r) => r.refId },
                { label: "Description", value: (r) => r.description },
                { label: "Direction", value: (r) => r.direction },
                { label: "Amount", value: (r) => r.amount },
                { label: "Balance after", value: (r) => r.balanceAfter },
                { label: "Created", value: (r) => r.createdAt },
              ]}
            />
          </>
        }
      />

      <div className="stat-grid listing__stats">
        <StatCard variant="inline" icon="wallet" label="USD float" value={formatMoneyPlain(floatStats.balance)} caption="Available now" series={smoothSeries("float-balance", 26)} />
        <StatCard variant="inline" icon="arrowUp" label="Credits today" value={formatMoney(floatStats.creditsToday)} caption="Since midnight" series={smoothSeries("float-credits", 26)} />
        <StatCard variant="inline" icon="arrowDown" label="Debits today" value={formatMoney(floatStats.debitsToday)} caption="Since midnight" series={smoothSeries("float-debits", 26)} />
        <StatCard variant="inline" icon="audit" label="Ledger entries" value={formatNumber(floatStats.entries)} caption="This period" series={smoothSeries("float-entries", 26)} />
      </div>

      <section className="panel-card u-mb-md">
        <div className="panel-card__head" style={{ paddingBottom: 0 }}>
          <div>
            <h2 className="panel-card__title">Balance trend</h2>
            <p className="panel-card__sub">Closing balance per day, {floatSummary.currency}</p>
          </div>
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() =>
              dispatch(
                pushToast({
                  tone: "info",
                  title: "Top up float",
                  text: "Wire instructions were emailed to the treasury contact.",
                })
              )
            }
          >
            <Icon name="upload" size={16} />
            Top up
          </button>
        </div>

        <AreaChart points={floatSummary.series} height={240} />
      </section>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1080}
        searchPlaceholder="Search entry or description..."
        unit="entries"
      />
    </div>
  );
}
