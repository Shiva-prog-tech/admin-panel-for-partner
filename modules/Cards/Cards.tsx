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
import Icon from "@/Components/Icons/Icon";
import useTableState from "@/customHooks/useTableState";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearFilters, selectStatuses, toggleStatus } from "@/redux/reducers/filtersSlice";
import { pushToast } from "@/redux/reducers/toastSlice";
import type { Card, Column } from "@/types/global";
import { cards as seededCards, cardStats } from "@/utils/mockData/cards";
import {
  formatDateTimeNumeric,
  formatMoney,
  formatNumber,
  truncateMiddle,
} from "@/utils/helper";

const RESOURCE = "cards";
const STATUSES = ["Active", "Frozen", "Terminated", "Pending"] as const;

export default function Cards() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectStatuses(RESOURCE));

  const filter = useMemo(() => {
    if (!selected.length) return undefined;
    return (row: Card) => selected.includes(row.status);
  }, [selected]);

  const state = useTableState<Card>({
    rows: seededCards,
    filter,
    searchFields: (row) => [row.refId, row.last4, row.cardholderRef, row.status],
    sortValue: (row, key) => (row as unknown as Record<string, string | number>)[key] ?? null,
  });

  const columns: Column<Card>[] = [
    {
      key: "refId",
      header: "Ref ID",
      sortable: true,
      render: (row) => <RefCell value={row.refId} />,
    },
    {
      key: "last4",
      header: "Card",
      sortable: true,
      render: (row) => (
        <span className="u-row" style={{ gap: 8 }}>
          <Icon name="card" size={16} />
          <span className="dt__strong dt__mono">•••• {row.last4}</span>
          <span className="tag">{row.scheme}</span>
        </span>
      ),
    },
    { key: "type", header: "Type", sortable: true, render: (row) => row.type },
    {
      key: "cardholderRef",
      header: "Cardholder",
      render: (row) => (
        <span className="dt__mono" title={row.cardholderRef}>
          {truncateMiddle(row.cardholderRef, 8, 6)}
        </span>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      align: "right",
      sortable: true,
      render: (row) => formatMoney(row.balance),
    },
    {
      key: "spend30d",
      header: "30d spend",
      align: "right",
      sortable: true,
      render: (row) => formatMoney(row.spend30d),
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
              { label: "View card", icon: "eye", onSelect: () => notify(row, "Card details") },
              { label: "Freeze card", icon: "snowflake", onSelect: () => notify(row, "Card frozen") },
              {
                label: "Terminate card",
                icon: "ban",
                danger: true,
                onSelect: () => notify(row, "Card terminated"),
              },
            ]}
          />
        </span>
      ),
    },
  ];

  function notify(row: Card, title: string) {
    dispatch(pushToast({ tone: "info", title, text: `•••• ${row.last4}` }));
  }

  return (
    <div className="listing">
      <PageHeader
        title="Cards"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Cards" }]}
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="cards.csv"
              rows={state.pageRows}
              columns={[
                { label: "Ref ID", value: (r) => r.refId },
                { label: "Last 4", value: (r) => r.last4 },
                { label: "Scheme", value: (r) => r.scheme },
                { label: "Type", value: (r) => r.type },
                { label: "Cardholder", value: (r) => r.cardholderRef },
                { label: "Balance", value: (r) => r.balance },
                { label: "30d spend", value: (r) => r.spend30d },
                { label: "Status", value: (r) => r.status },
                { label: "Created", value: (r) => r.createdAt },
              ]}
            />
          </>
        }
      />

      <div className="stat-grid listing__stats">
        <StatCard variant="inline" icon="card" label="Cards issued" value={formatNumber(cardStats.total)} caption="All time" series={cardStats.series.total} />
        <StatCard variant="inline" icon="checkCircle" label="Active" value={formatNumber(cardStats.active)} caption="Spendable now" series={cardStats.series.active} />
        <StatCard variant="inline" icon="snowflake" label="Frozen" value={formatNumber(cardStats.frozen)} caption="Temporarily blocked" series={cardStats.series.frozen} />
        <StatCard variant="inline" icon="package" label="Physical" value={formatNumber(cardStats.physical)} caption="Shipped plastic" series={cardStats.series.physical} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1180}
        searchPlaceholder="Search ref ID or last 4..."
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
              className="btn btn--brand"
              onClick={() =>
                dispatch(
                  pushToast({
                    tone: "info",
                    title: "Issue a card",
                    text: "Pick a cardholder from the Cardholders page to issue against.",
                  })
                )
              }
            >
              <Icon name="plus" size={17} />
              <span>Issue card</span>
            </button>
          </>
        }
      />
    </div>
  );
}
