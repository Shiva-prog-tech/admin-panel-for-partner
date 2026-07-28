"use client";

import PageHeader from "@/Components/PageHeader/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker/DateRangePicker";
import StatCard from "@/Components/StatCard/StatCard";
import TableCard from "@/Components/Table/TableCard";
import RowMenu from "@/Components/Table/RowMenu";
import ExportButton from "@/Components/Table/ExportButton";
import Badge from "@/Components/Badge/Badge";
import Icon from "@/Components/Icons/Icon";
import useTableState from "@/customHooks/useTableState";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/toastSlice";
import type { Column, WebhookEndpoint } from "@/types/global";
import { webhookEndpoints, webhookStats } from "@/utils/mockData/webhooks";
import { DATASET_NOW } from "@/utils/Config";
import { formatNumber, formatPercent, relativeFrom } from "@/utils/helper";

export default function Webhooks() {
  const dispatch = useAppDispatch();

  const state = useTableState<WebhookEndpoint>({
    rows: webhookEndpoints,
    searchFields: (row) => [row.url, row.state, ...row.events],
    sortValue: (row, key) => (row as unknown as Record<string, string | number>)[key] ?? null,
    pageSize: 10,
  });

  const columns: Column<WebhookEndpoint>[] = [
    {
      key: "url",
      header: "Endpoint",
      sortable: true,
      render: (row) => (
        <span className="u-row" style={{ gap: 9 }}>
          <Icon name="webhook" size={16} />
          <span className="dt__strong dt__mono">{row.url}</span>
        </span>
      ),
    },
    {
      key: "events",
      header: "Events",
      render: (row) => (
        <span className="u-row" style={{ gap: 6, flexWrap: "wrap" }}>
          {row.events.slice(0, 2).map((event) => (
            <span className="tag" key={event}>
              {event}
            </span>
          ))}
          {row.events.length > 2 && <span className="tag">+{row.events.length - 2}</span>}
        </span>
      ),
    },
    {
      key: "successRate",
      header: "Success rate",
      align: "right",
      sortable: true,
      render: (row) => (
        <span
          className="dt__strong"
          style={{
            color:
              row.successRate >= 99.5
                ? "var(--green-text)"
                : row.successRate >= 95
                  ? "var(--amber-text)"
                  : "var(--red-text)",
          }}
        >
          {formatPercent(row.successRate)}
        </span>
      ),
    },
    {
      key: "lastDelivery",
      header: "Last delivery",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => relativeFrom(row.lastDelivery, DATASET_NOW),
    },
    { key: "state", header: "State", sortable: true, render: (row) => <Badge>{row.state}</Badge> },
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
                label: "Send test event",
                icon: "send",
                onSelect: () =>
                  dispatch(
                    pushToast({ tone: "success", title: "Test event queued", text: row.url })
                  ),
              },
              {
                label: "View deliveries",
                icon: "audit",
                onSelect: () =>
                  dispatch(pushToast({ tone: "info", title: "Deliveries", text: row.url })),
              },
              {
                label: row.state === "Paused" ? "Resume endpoint" : "Pause endpoint",
                icon: row.state === "Paused" ? "refresh" : "ban",
                danger: row.state !== "Paused",
                onSelect: () =>
                  dispatch(
                    pushToast({
                      tone: "info",
                      title: row.state === "Paused" ? "Endpoint resumed" : "Endpoint paused",
                      text: row.url,
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
    <div className="listing">
      <PageHeader
        title="Webhooks"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Webhooks" }]}
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="webhook-endpoints.csv"
              rows={state.pageRows}
              columns={[
                { label: "Endpoint", value: (r) => r.url },
                { label: "Events", value: (r) => r.events.join(" ") },
                { label: "Success rate", value: (r) => r.successRate },
                { label: "Last delivery", value: (r) => r.lastDelivery },
                { label: "State", value: (r) => r.state },
              ]}
            />
          </>
        }
      />

      <div className="stat-grid listing__stats">
        <StatCard variant="inline" icon="webhook" label="Endpoints" value={formatNumber(webhookStats.endpoints)} caption="Configured" series={webhookStats.series.endpoints} />
        <StatCard variant="inline" icon="checkCircle" label="Healthy" value={formatNumber(webhookStats.healthy)} caption="Right now" series={webhookStats.series.healthy} />
        <StatCard variant="inline" icon="alert" label="Issues (7d)" value={formatNumber(webhookStats.issues7d)} caption="Last 7 days" series={webhookStats.series.issues} />
        <StatCard variant="inline" icon="send" label="Deliveries (24h)" value={formatNumber(webhookStats.deliveries24h)} caption="Last 24 hours" series={webhookStats.series.deliveries} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1180}
        searchPlaceholder="Search endpoint or event..."
        unit="endpoints"
        toolbarRight={
          <button
            type="button"
            className="btn btn--brand"
            onClick={() =>
              dispatch(
                pushToast({
                  tone: "info",
                  title: "Add endpoint",
                  text: "Provide an HTTPS URL and pick the events to subscribe to.",
                })
              )
            }
          >
            <Icon name="plus" size={17} />
            <span>Add endpoint</span>
          </button>
        }
      />
    </div>
  );
}
