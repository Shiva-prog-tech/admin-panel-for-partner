"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/Components/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker";
import StatCard from "@/Components/StatCard";
import TableCard from "@/Components/Table/Table_V2";
import RefCell from "@/Components/RefCell";
import RowMenu from "@/Components/RowMenu";
import FilterMenu from "@/Components/FilterMenu";
import ExportButton from "@/Components/ExportButton";
import Badge from "@/Components/Badge";
import Icon from "@/Components/Icons";
import AddCardholderModal from "./components/AddCardholderModal";
import useTableState from "@/customHooks/useTableState";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearFilters, selectStatuses, toggleStatus } from "@/redux/reducers/FiltersReducer";
import { openPopup } from "@/redux/reducers/PopUpsReducer";
import { pushToast } from "@/redux/reducers/ToastReducer";
import { CARDHOLDER_STATUSES } from "@/types/constants";
import type { Column } from "@/types/global";
import type { Cardholder } from "./types";
import {
  cardholders as seededCardholders,
  cardholderStats,
} from "@/mockData/cardholders";
import { cx, formatDateTimeLong, formatNumber, share } from "@/utils/helper";
import { buttonStyles } from "@/Components/Button";
import { listingStyles } from "@/Components/ListingPage";

const RESOURCE = "cardholders";

export default function Cardholders() {
  const dispatch = useAppDispatch();
  const selectedStatuses = useAppSelector(selectStatuses(RESOURCE));

  const [created, setCreated] = useState<Cardholder[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const rows = useMemo(() => [...created, ...seededCardholders], [created]);

  const statusFilter = useMemo(() => {
    if (!selectedStatuses.length) return undefined;
    return (row: Cardholder) => selectedStatuses.includes(row.status);
  }, [selectedStatuses]);

  const state = useTableState<Cardholder>({
    rows,
    filter: statusFilter,
    searchFields: (row) => [row.refId, row.product, row.status, row.reason],
    sortValue: (row, key) => {
      switch (key) {
        case "refId":
          return row.refId;
        case "product":
          return row.product;
        case "status":
          return row.status;
        case "cards":
          return row.cards;
        case "wallets":
          return row.wallets;
        case "deposited":
          return row.deposited;
        case "createdAt":
          return row.createdAt;
        default:
          return null;
      }
    },
  });

  const columns: Column<Cardholder>[] = [
    {
      key: "refId",
      header: "Ref ID",
      sortable: true,
      render: (row) => (
        <RefCell
          value={row.refId}
          onOpen={() =>
            dispatch(
              pushToast({ tone: "info", title: "Cardholder", text: row.refId })
            )
          }
        />
      ),
    },
    {
      key: "product",
      header: "Product",
      sortable: true,
      render: (row) => <span className="dt__strong">{row.product}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <Badge>{row.status}</Badge>,
    },
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
    { key: "cards", header: "Cards", align: "center", render: (row) => row.cards },
    { key: "wallets", header: "Wallets", align: "center", render: (row) => row.wallets },
    {
      key: "deposited",
      header: "Deposited",
      align: "center",
      render: (row) =>
        row.deposited == null ? (
          <span className="dt__muted">—</span>
        ) : (
          formatNumber(row.deposited)
        ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => formatDateTimeLong(row.createdAt),
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
                label: "View application",
                icon: "eye",
                onSelect: () =>
                  dispatch(
                    pushToast({ tone: "info", title: "Cardholder", text: row.refId })
                  ),
              },
              {
                label: "Approve",
                icon: "checkCircle",
                onSelect: () =>
                  dispatch(
                    pushToast({
                      tone: "success",
                      title: "Cardholder approved",
                      text: row.refId,
                    })
                  ),
              },
              {
                label: "Reject application",
                icon: "ban",
                danger: true,
                onSelect: () =>
                  dispatch(openPopup({ name: "confirmReject", subject: row.refId })),
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
        title="Cardholders"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Cardholders" }]}
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="cardholders.csv"
              rows={state.pageRows}
              columns={[
                { label: "Ref ID", value: (r) => r.refId },
                { label: "Product", value: (r) => r.product },
                { label: "Status", value: (r) => r.status },
                { label: "Reason", value: (r) => r.reason },
                { label: "Cards", value: (r) => r.cards },
                { label: "Wallets", value: (r) => r.wallets },
                { label: "Deposited", value: (r) => r.deposited },
                { label: "Created", value: (r) => r.createdAt },
              ]}
            />
          </>
        }
      />

      <div className={listingStyles.stats}>
        <StatCard
          variant="inline"
          icon="users"
          label="Total cardholders"
          value={formatNumber(cardholderStats.total)}
          caption="All time"
          series={cardholderStats.series.total}
        />
        <StatCard
          variant="inline"
          icon="card"
          label="Approved"
          value={formatNumber(cardholderStats.approved)}
          caption={`${share(cardholderStats.approved, cardholderStats.total)} of total`}
          series={cardholderStats.series.approved}
        />
        <StatCard
          variant="inline"
          icon="shield"
          label="Rejected"
          value={formatNumber(cardholderStats.rejected)}
          caption={`${share(cardholderStats.rejected, cardholderStats.total)} of total`}
          series={cardholderStats.series.rejected}
        />
        <StatCard
          variant="inline"
          icon="clock"
          label="Pending"
          value={formatNumber(cardholderStats.pending)}
          caption={`${share(cardholderStats.pending, cardholderStats.total)} of total`}
          series={cardholderStats.series.pending}
        />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1140}
        toolbarRight={
          <>
            <FilterMenu
              options={CARDHOLDER_STATUSES}
              selected={selectedStatuses}
              showCaret
              onToggle={(status) => dispatch(toggleStatus({ resource: RESOURCE, status }))}
              onClear={() => dispatch(clearFilters(RESOURCE))}
            />
            <button
              type="button"
              className={cx(buttonStyles.btn, buttonStyles.brand)}
              onClick={() => setAddOpen(true)}
            >
              <Icon name="plus" size={17} />
              <span>Add cardholder</span>
            </button>
          </>
        }
      />

      <AddCardholderModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={(cardholder) => {
          setCreated((current) => [cardholder, ...current]);
          dispatch(
            pushToast({
              tone: "success",
              title: "Cardholder submitted for review",
              text: `Ref ID ${cardholder.refId}`,
            })
          );
        }}
      />

    </div>
  );
}
