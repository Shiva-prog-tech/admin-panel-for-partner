"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/Components/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker";
import StatCard from "@/Components/StatCard";
import TableCard from "@/Components/Table/Table_V2";
import SelectFilter from "@/Components/SelectFilter";
import RowMenu from "@/Components/RowMenu";
import ExportButton from "@/Components/ExportButton";
import Badge from "@/Components/Badge";
import Icon from "@/Components/Icons";
import WebhookConfigCard from "./components/WebhookConfigCard";
import useServerTable from "@/customHooks/useServerTable";
import webhooksService from "./services/webhooksService";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/ToastReducer";
import { DELIVERY_STATUS_OPTIONS } from "./constants";
import type { Column } from "@/types/global";
import type { WebhookDelivery } from "./types";
import { deliveryStats } from "@/mockData/webhookDeliveries";
import { webhookStats } from "@/mockData/webhooks";
import { cx, formatDateTimeNumeric, formatNumber } from "@/utils/helper";
import { buttonStyles } from "@/Components/Button";
import { panelStyles } from "@/Components/PanelCard";
import { listingStyles } from "@/Components/ListingPage";

export default function Webhooks() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("");

  const state = useServerTable<WebhookDelivery>({
    fetcher: webhooksService.deliveries,
    filters: { status },
  });

  const columns: Column<WebhookDelivery>[] = [
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => formatDateTimeNumeric(row.createdAt),
    },
    {
      key: "event",
      header: "Event",
      sortable: true,
      render: (row) => <span className="dt__mono">{row.event}</span>,
    },
    {
      key: "refId",
      header: "Ref ID",
      sortable: true,
      render: (row) => <span className="dt__mono">{row.refId}</span>,
    },
    { key: "status", header: "Status", sortable: true, render: (row) => <Badge>{row.status}</Badge> },
    {
      key: "attempts",
      header: "Attempts",
      align: "center",
      sortable: true,
      render: (row) => row.attempts,
    },
    {
      key: "error",
      header: "Error",
      render: (row) =>
        row.error ? (
          <span className="dt__reason">{row.error}</span>
        ) : (
          <span className="dt__muted">—</span>
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
                label: "View payload",
                icon: "eye",
                onSelect: () =>
                  dispatch(pushToast({ tone: "info", title: row.event, text: row.refId })),
              },
              {
                label: "Replay delivery",
                icon: "refresh",
                onSelect: () =>
                  dispatch(
                    pushToast({
                      tone: "success",
                      title: "Delivery replayed",
                      text: `${row.event} · ${row.refId}`,
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
        title="Webhooks"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Webhooks" }]}
        subtitle="Outbound event delivery for this tenant"
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="webhook-deliveries.csv"
              rows={state.pageRows}
              columns={[
                { label: "Date", value: (r) => r.createdAt },
                { label: "Event", value: (r) => r.event },
                { label: "Ref ID", value: (r) => r.refId },
                { label: "Status", value: (r) => r.status },
                { label: "Attempts", value: (r) => r.attempts },
                { label: "Error", value: (r) => r.error },
              ]}
            />
          </>
        }
      />

      <div className={listingStyles.stats}>
        <StatCard variant="inline" icon="send" label="Deliveries" value={formatNumber(deliveryStats.total)} caption="This period" series={webhookStats.series.deliveries} />
        <StatCard variant="inline" icon="checkCircle" label="Delivered" value={formatNumber(deliveryStats.delivered)} caption="This period" series={webhookStats.series.healthy} />
        <StatCard variant="inline" icon="alert" label="Failed" value={formatNumber(deliveryStats.failed)} caption="This period" series={webhookStats.series.issues} />
        <StatCard variant="inline" icon="clock" label="Pending" value={formatNumber(deliveryStats.pending)} caption="Awaiting retry" series={webhookStats.series.endpoints} />
      </div>

      <WebhookConfigCard />

      <h2 className={panelStyles.sectionTitle}>Delivery log</h2>
      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1180}
        searchPlaceholder="Search event, ref ID..."
        unit="deliveries"
        toolbarRight={
          <>
            <SelectFilter
              label="Delivery status"
              value={status}
              onChange={setStatus}
              options={DELIVERY_STATUS_OPTIONS}
            />
            <button
              type="button"
              className={cx(buttonStyles.btn, buttonStyles.ghost)}
              onClick={() =>
                dispatch(
                  pushToast({
                    tone: "success",
                    title: "Test event queued",
                    text: "cardholder.updated will be delivered shortly.",
                  })
                )
              }
            >
              <Icon name="send" size={16} />
              <span>Send test event</span>
            </button>
          </>
        }
      />
    </div>
  );
}
