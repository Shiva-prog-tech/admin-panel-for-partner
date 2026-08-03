"use client";

import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker";
import StatCard from "@/Components/StatCard";
import TableCard from "@/Components/Table/Table_V2";
import SelectFilter from "@/Components/SelectFilter";
import RefCell from "@/Components/RefCell";
import RowMenu from "@/Components/RowMenu";
import ExportButton from "@/Components/ExportButton";
import Badge from "@/Components/Badge";
import Icon from "@/Components/Icons";
import useServerTable from "@/customHooks/useServerTable";
import cardsService from "./services/cardsService";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/ToastReducer";
import { CARD_STATUSES } from "./constants";
import type { Column, SelectOption } from "@/types/global";
import type { Card } from "./types";
import { cardStats } from "@/mockData/cards";
import { cx, formatDateTimeNumeric, formatMoneyPlain, formatNumber } from "@/utils/helper";
import { buttonStyles } from "@/Components/Button";
import { listingStyles } from "@/Components/ListingPage";

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All statuses" },
  ...CARD_STATUSES.map((status) => ({ value: status, label: status })),
];

export default function Cards() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("");

  const state = useServerTable<Card>({
    fetcher: cardsService.list,
    filters: { status },
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
    <div className={listingStyles.page}>
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

      <div className={listingStyles.stats}>
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
              className={cx(buttonStyles.btn, buttonStyles.brand)}
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
