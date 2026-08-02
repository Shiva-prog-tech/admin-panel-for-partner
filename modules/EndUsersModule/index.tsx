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
import AddEndUserModal from "./components/AddEndUserModal";
import useTableState from "@/customHooks/useTableState";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearFilters, selectStatuses, toggleStatus } from "@/redux/reducers/FiltersReducer";
import { openPopup } from "@/redux/reducers/PopUpsReducer";
import { pushToast } from "@/redux/reducers/ToastReducer";
import { END_USER_STATUSES } from "@/types/constants";
import type { Column, EndUser } from "@/types/global";
import { endUsers as seededUsers, endUserStats } from "@/utils/mockData/endUsers";
import { cx, formatDateTimeNumeric, formatNumber } from "@/utils/helper";
import { buttonStyles } from "@/Components/Button";
import { listingStyles } from "@/Components/ListingPage";

const RESOURCE = "endUsers";

export default function EndUsers() {
  const dispatch = useAppDispatch();
  const selectedStatuses = useAppSelector(selectStatuses(RESOURCE));

  const [created, setCreated] = useState<EndUser[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const rows = useMemo(() => [...created, ...seededUsers], [created]);

  const statusFilter = useMemo(() => {
    if (!selectedStatuses.length) return undefined;
    return (row: EndUser) => selectedStatuses.includes(row.status);
  }, [selectedStatuses]);

  const state = useTableState<EndUser>({
    rows,
    filter: statusFilter,
    searchFields: (row) => [row.refId, row.status],
    sortValue: (row, key) => {
      switch (key) {
        case "refId":
          return row.refId;
        case "cards":
          return row.cards;
        case "cardholders":
          return row.cardholders;
        case "cardTxs":
          return row.cardTxs;
        case "walletTxs":
          return row.walletTxs;
        case "deposited":
          return row.deposited;
        case "createdAt":
          return row.createdAt;
        case "status":
          return row.status;
        default:
          return null;
      }
    },
  });

  const columns: Column<EndUser>[] = [
    {
      key: "refId",
      header: "Ref ID",
      sortable: true,
      render: (row) => (
        <RefCell
          value={row.refId}
          onOpen={() =>
            dispatch(
              pushToast({
                tone: "info",
                title: "End user",
                text: row.refId,
              })
            )
          }
        />
      ),
    },
    { key: "cards", header: "Cards", align: "center", render: (row) => row.cards },
    {
      key: "cardholders",
      header: "Cardholders",
      align: "center",
      render: (row) => row.cardholders,
    },
    { key: "cardTxs", header: "Card txs", align: "center", render: (row) => row.cardTxs },
    {
      key: "walletTxs",
      header: "Wallet txs",
      align: "center",
      render: (row) => row.walletTxs,
    },
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
      render: (row) => formatDateTimeNumeric(row.createdAt),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge>{row.status}</Badge>,
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
                label: "View details",
                icon: "eye",
                onSelect: () =>
                  dispatch(
                    pushToast({ tone: "info", title: "End user", text: row.refId })
                  ),
              },
              {
                label: "Resend invitation",
                icon: "send",
                onSelect: () =>
                  dispatch(
                    pushToast({
                      tone: "success",
                      title: "Invitation resent",
                      text: row.refId,
                    })
                  ),
              },
              {
                label: "Suspend user",
                icon: "ban",
                danger: true,
                onSelect: () =>
                  dispatch(openPopup({ name: "confirmSuspend", subject: row.refId })),
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
        title="End users"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "End users" }]}
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="end-users.csv"
              rows={state.pageRows}
              columns={[
                { label: "Ref ID", value: (r) => r.refId },
                { label: "Cards", value: (r) => r.cards },
                { label: "Cardholders", value: (r) => r.cardholders },
                { label: "Card txs", value: (r) => r.cardTxs },
                { label: "Wallet txs", value: (r) => r.walletTxs },
                { label: "Deposited", value: (r) => r.deposited },
                { label: "Created", value: (r) => r.createdAt },
                { label: "Status", value: (r) => r.status },
              ]}
            />
          </>
        }
      />

      <div className={listingStyles.stats}>
        <StatCard
          variant="inline"
          icon="users"
          label="Total end users"
          value={formatNumber(endUserStats.total)}
          caption="All time"
          series={endUserStats.series.total}
        />
        <StatCard
          variant="inline"
          icon="card"
          label="Cards issued"
          value={formatNumber(endUserStats.cardsIssued)}
          caption="All time"
          series={endUserStats.series.cards}
        />
        <StatCard
          variant="inline"
          icon="user"
          label="Active users"
          value={formatNumber(endUserStats.activeThisWeek)}
          caption="This week"
          series={endUserStats.series.active}
        />
        <StatCard
          variant="inline"
          icon="activity"
          label="Activity events"
          value={formatNumber(endUserStats.activityEvents)}
          caption="This week"
          series={endUserStats.series.events}
        />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1020}
        toolbarRight={
          <>
            <FilterMenu
              options={END_USER_STATUSES}
              selected={selectedStatuses}
              onToggle={(status) => dispatch(toggleStatus({ resource: RESOURCE, status }))}
              onClear={() => dispatch(clearFilters(RESOURCE))}
            />
            <button
              type="button"
              className={cx(buttonStyles.btn, buttonStyles.brand)}
              onClick={() => setAddOpen(true)}
            >
              <Icon name="plus" size={17} />
              <span>Add user</span>
            </button>
          </>
        }
      />

      <AddEndUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={(user) => {
          setCreated((current) => [user, ...current]);
          dispatch(
            pushToast({
              tone: "success",
              title: "Invitation sent",
              text: `Ref ID ${user.refId}`,
            })
          );
        }}
      />

    </div>
  );
}
