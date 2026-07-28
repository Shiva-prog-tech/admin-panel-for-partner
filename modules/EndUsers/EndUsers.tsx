"use client";

import { useMemo, useState } from "react";
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
import ConfirmPopup from "@/Components/PopUps/ConfirmPopup";
import AddEndUserModal from "./AddEndUserModal";
import useTableState from "@/customHooks/useTableState";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearFilters, selectStatuses, toggleStatus } from "@/redux/reducers/filtersSlice";
import { pushToast } from "@/redux/reducers/toastSlice";
import { END_USER_STATUSES } from "@/types/constants";
import type { Column, EndUser } from "@/types/global";
import { endUsers as seededUsers, endUserStats } from "@/utils/mockData/endUsers";
import { formatDateTimeNumeric, formatNumber } from "@/utils/helper";

const RESOURCE = "endUsers";

export default function EndUsers() {
  const dispatch = useAppDispatch();
  const selectedStatuses = useAppSelector(selectStatuses(RESOURCE));

  const [created, setCreated] = useState<EndUser[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<EndUser | null>(null);

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
                onSelect: () => setSuspendTarget(row),
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

      <div className="stat-grid listing__stats">
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
              className="btn btn--brand"
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

      <ConfirmPopup
        open={suspendTarget !== null}
        title="Suspend this end user?"
        message={`Suspending ${suspendTarget?.refId ?? ""} blocks new authorisations immediately. Existing cards stay frozen until the account is reactivated.`}
        confirmLabel="Suspend user"
        danger
        onClose={() => setSuspendTarget(null)}
        onConfirm={() =>
          dispatch(
            pushToast({
              tone: "success",
              title: "User suspended",
              text: suspendTarget?.refId,
            })
          )
        }
      />
    </div>
  );
}
