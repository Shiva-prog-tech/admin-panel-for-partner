"use client";

import { useState } from "react";
import PageHeader from "@/Components/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker";
import StatCard from "@/Components/StatCard";
import TableCard from "@/Components/Table/Table_V2";
import SelectFilter from "@/Components/SelectFilter";
import ExportButton from "@/Components/ExportButton";
import Icon from "@/Components/Icons";
import useServerTable from "@/customHooks/useServerTable";
import auditLogService from "./services/auditLogService";
import { API_STATUS_OPTIONS } from "./constants";
import styles from "./AuditLogModule.module.scss";
import type { Column } from "@/types/global";
import type { ApiRequestLog, AuditEvent } from "./types";
import { apiRequestStats } from "@/mockData/apiAuditLog";
import { auditStats } from "@/mockData/auditLog";
import { panelStyles } from "@/Components/PanelCard";
import { listingStyles } from "@/Components/ListingPage";
import {
  formatDateTimeNumeric,
  formatNumber,
  smoothSeries,
  truncateMiddle,
} from "@/utils/helper";

/** HTTP status → the colour it reads as in the table. */
function statusColor(status: number): string | undefined {
  if (status >= 500) return "var(--red-text)";
  if (status >= 400) return "var(--amber-text)";
  if (status >= 200 && status < 300) return "var(--green-text)";
  return undefined;
}

function actionColor(action: string): string | undefined {
  if (/(rejected|suspended|revoked|frozen)$/.test(action)) return "var(--red-text)";
  if (/(approved|issued|created|topped_up)$/.test(action)) return "var(--green-text)";
  return undefined;
}

export default function AuditLog() {
  const [bucket, setBucket] = useState("");

  // --- machine API requests -------------------------------------------------
  const requests = useServerTable<ApiRequestLog>({
    fetcher: auditLogService.apiRequests,
    filters: { status: bucket },
  });

  const requestColumns: Column<ApiRequestLog>[] = [
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => formatDateTimeNumeric(row.createdAt),
    },
    {
      key: "method",
      header: "Method",
      sortable: true,
      render: (row) => <span className={styles.method}>{row.method}</span>,
    },
    {
      key: "path",
      header: "Path",
      sortable: true,
      render: (row) => (
        <span className="dt__mono" title={row.path}>
          {row.path}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      sortable: true,
      render: (row) => (
        <span className="dt__strong" style={{ color: statusColor(row.status) }}>
          {row.status}
        </span>
      ),
    },
    {
      key: "refId",
      header: "Ref ID",
      render: (row) => <span className="dt__mono">{row.refId}</span>,
    },
    {
      key: "latencyMs",
      header: "Latency",
      align: "right",
      sortable: true,
      render: (row) => (
        <span className="u-tnum">{formatNumber(row.latencyMs)} ms</span>
      ),
    },
  ];

  // --- admin activity -------------------------------------------------------
  const events = useServerTable<AuditEvent>({
    fetcher: auditLogService.adminActivity,
  });

  const eventColumns: Column<AuditEvent>[] = [
    {
      key: "createdAt",
      header: "When",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => formatDateTimeNumeric(row.createdAt),
    },
    {
      key: "actor",
      header: "Actor",
      sortable: true,
      render: (row) => (
        <span className="u-row" style={{ gap: 9 }}>
          <Icon name={row.actor.startsWith("ops.bot") ? "settings" : "user"} size={15} />
          <span className="dt__strong">{row.actor}</span>
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      render: (row) => (
        <span className="dt__mono" style={{ color: actionColor(row.action) }}>
          {row.action}
        </span>
      ),
    },
    {
      key: "target",
      header: "Target",
      render: (row) => (
        <span className="dt__mono" title={row.target}>
          {truncateMiddle(row.target, 12, 6)}
        </span>
      ),
    },
    {
      key: "ip",
      header: "IP address",
      align: "right",
      render: (row) => <span className="dt__mono dt__muted">{row.ip}</span>,
    },
  ];

  return (
    <div className={listingStyles.page}>
      <PageHeader
        title="API audit log"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Audit log" }]}
        subtitle="Every machine request against the partner API, plus admin activity"
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="api-audit-log.csv"
              rows={requests.pageRows}
              columns={[
                { label: "Date", value: (r) => r.createdAt },
                { label: "Method", value: (r) => r.method },
                { label: "Path", value: (r) => r.path },
                { label: "Status", value: (r) => r.status },
                { label: "Ref ID", value: (r) => r.refId },
                { label: "Latency (ms)", value: (r) => r.latencyMs },
              ]}
            />
          </>
        }
      />

      <div className={listingStyles.stats}>
        <StatCard variant="inline" icon="activity" label="API calls (24h)" value={formatNumber(apiRequestStats.calls24h)} caption="Machine API traffic" series={smoothSeries("ar-total", 26)} />
        <StatCard variant="inline" icon="checkCircle" label="2xx responses" value={formatNumber(apiRequestStats.ok)} caption="This period" series={smoothSeries("ar-ok", 26)} />
        <StatCard variant="inline" icon="alert" label="4xx / 5xx" value={formatNumber(apiRequestStats.clientErrors + apiRequestStats.serverErrors)} caption="This period" series={smoothSeries("ar-err", 26)} />
        <StatCard variant="inline" icon="clock" label="p95 latency" value={`${formatNumber(apiRequestStats.p95LatencyMs)} ms`} caption="This period" series={smoothSeries("ar-latency", 26)} />
      </div>

      <h2 className={panelStyles.sectionTitle}>Machine API requests</h2>
      <div className="u-mb-md">
        <TableCard
          state={requests}
          columns={requestColumns}
          rowKey={(row) => row.id}
          minWidth={1180}
          searchPlaceholder="Search path, method, ref ID..."
          unit="requests"
          toolbarRight={
            <SelectFilter
              label="Response status"
              value={bucket}
              onChange={setBucket}
              options={API_STATUS_OPTIONS}
            />
          }
        />
      </div>

      <h2 className={panelStyles.sectionTitle}>Admin activity</h2>
      <TableCard
        state={events}
        columns={eventColumns}
        rowKey={(row) => row.id}
        minWidth={1060}
        searchPlaceholder="Search actor, action or target..."
        unit="events"
      />

      <p className={listingStyles.note}>
        <Icon name="info" size={14} />
        {formatNumber(auditStats.today)} admin actions today across{" "}
        {auditStats.actors} actors
      </p>
    </div>
  );
}
