"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/Components/PageHeader/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker/DateRangePicker";
import StatCard from "@/Components/StatCard/StatCard";
import TableCard from "@/Components/Table/TableCard";
import SelectFilter from "@/Components/Table/SelectFilter";
import RefCell from "@/Components/Table/RefCell";
import RowMenu from "@/Components/Table/RowMenu";
import ExportButton from "@/Components/Table/ExportButton";
import Badge from "@/Components/Badge/Badge";
import Icon from "@/Components/Icons/Icon";
import useTableState from "@/customHooks/useTableState";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/toastSlice";
import { CARD_STATUSES } from "@/types/constants";
import type { Card, Column, SelectOption } from "@/types/global";
import { cards, cardStats } from "@/utils/mockData/cards";
import { formatDateTimeNumeric, formatMoneyPlain, formatNumber } from "@/utils/helper";

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All statuses" },
  ...CARD_STATUSES.map((status) => ({ value: status, label: status })),
];

export default function Cards() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("");

  const filter = useMemo(() => {
    if (!status) return undefined;
    return (row: Card) => row.status === status;
  }, [status]);

  const state = useTableState<Card>({
    rows: cards,
    filter,
    searchFields: (row) => [row.refId, row.cardNo, row.last4, row.product, row.status],
    sortValue: (row, key) =>
      (row as unknown as Record<string, string | number | null>)[key] ?? null,
  });

  const notify = (row: Card, title: string) =>
    dispatch(
      pushToast({
        tone: "info",
        title,
        text: row.last4 ? `•••• ${row.last4}` : row.cardNo,
      })
    );

  const columns: Column<Card>[] = [
    {
      key: "refId",
      header: "Ref ID",
      sortable: true,
      render: (row) => <RefCell value={row.refId} />,
    },
    {
      key: "cardNumberMasked",
      header: "Card number",
      render: (row) =>
        row.cardNumberMasked ? (
          <span className="dt__mono dt__strong">{row.cardNumberMasked}</span>
        ) : (
          <span className="dt__muted">–</span>
        ),
    },
    {
      key: "cardNo",
      header: "Card no",
      sortable: true,
      render: (row) => (
        <span className="dt__mono card-no" title={row.cardNo}>
          {row.cardNo}
        </span>
      ),
    },
    {
      key: "last4",
      header: "Last 4",
      align: "center",
      sortable: true,
      render: (row) =>
        row.last4 ? (
          <span className="dt__mono">{row.last4}</span>
        ) : (
          <span className="dt__muted">—</span>
        ),
    },
    {
      key: "balance",
      header: "Balance",
      align: "right",
      sortable: true,
      render: (row) =>
        row.balance == null ? (
          <span className="dt__muted">—</span>
        ) : (
          <span className="dt__strong">
            {formatMoneyPlain(row.balance, "")} {row.currency}
          </span>
        ),
    },
    {
      key: "product",
      header: "Product",
      sortable: true,
      render: (row) => <span className="dt__mono">{row.product}</span>,
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
              { label: "View card", icon: "eye", onSelect: () => notify(row, "Card details") },
              { label: "Top up card", icon: "upload", onSelect: () => notify(row, "Top-up started") },
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

  return (
    <div className="listing">
      <PageHeader
        title="Cards"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Cards" }]}
        subtitle="Virtual and physical cards issued to your cardholders"
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="cards.csv"
              rows={state.pageRows}
              columns={[
                { label: "Ref ID", value: (r) => r.refId },
                { label: "Card number", value: (r) => r.cardNumberMasked },
                { label: "Card no", value: (r) => r.cardNo },
                { label: "Last 4", value: (r) => r.last4 },
                { label: "Balance", value: (r) => r.balance },
                { label: "Currency", value: (r) => r.currency },
                { label: "Product", value: (r) => r.product },
                { label: "Status", value: (r) => r.status },
                { label: "Created", value: (r) => r.createdAt },
              ]}
            />
          </>
        }
      />

      <div className="stat-grid listing__stats">
        <StatCard variant="inline" icon="card" label="Cards issued" value={formatNumber(cardStats.total)} caption="All time" series={cardStats.series.total} />
        <StatCard variant="inline" icon="checkCircle" label="Normal" value={formatNumber(cardStats.normal)} caption="Spendable now" series={cardStats.series.normal} />
        <StatCard variant="inline" icon="snowflake" label="Frozen" value={formatNumber(cardStats.frozen)} caption="Temporarily blocked" series={cardStats.series.frozen} />
        <StatCard variant="inline" icon="clock" label="Pending" value={formatNumber(cardStats.pending)} caption="Awaiting issuer" series={cardStats.series.pending} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1460}
        searchPlaceholder="Search ref ID, card no, last 4..."
        unit="cards"
        toolbarRight={
          <>
            <SelectFilter
              label="Card status"
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
            />
            <button
              type="button"
              className="btn btn--brand"
              onClick={() =>
                dispatch(
                  pushToast({
                    tone: "info",
                    title: "Issue a card",
                    text: "Pick an approved cardholder to issue against.",
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
