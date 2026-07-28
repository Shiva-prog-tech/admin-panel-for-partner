"use client";

import PageHeader from "@/Components/PageHeader/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker/DateRangePicker";
import StatCard from "@/Components/StatCard/StatCard";
import TableCard from "@/Components/Table/TableCard";
import ExportButton from "@/Components/Table/ExportButton";
import Icon from "@/Components/Icons/Icon";
import useTableState from "@/customHooks/useTableState";
import type { AuditEvent, Column } from "@/types/global";
import { auditEvents, auditStats } from "@/utils/mockData/auditLog";
import { formatDateTimeNumeric, formatNumber, smoothSeries, truncateMiddle } from "@/utils/helper";

/** Verb → tone mapping keeps the action column scannable. */
function actionColor(action: string): string | undefined {
  if (/(rejected|suspended|revoked|frozen)$/.test(action)) return "var(--red-text)";
  if (/(approved|issued|created|topped_up)$/.test(action)) return "var(--green-text)";
  return undefined;
}

export default function AuditLog() {
  const state = useTableState<AuditEvent>({
    rows: auditEvents,
    searchFields: (row) => [row.actor, row.action, row.target, row.ip],
    sortValue: (row, key) => (row as unknown as Record<string, string | number>)[key] ?? null,
  });

  const columns: Column<AuditEvent>[] = [
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
    <div className="listing">
      <PageHeader
        title="Audit log"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Audit log" }]}
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="audit-log.csv"
              rows={state.pageRows}
              columns={[
                { label: "When", value: (r) => r.createdAt },
                { label: "Actor", value: (r) => r.actor },
                { label: "Action", value: (r) => r.action },
                { label: "Target", value: (r) => r.target },
                { label: "IP", value: (r) => r.ip },
              ]}
            />
          </>
        }
      />

      <div className="stat-grid listing__stats">
        <StatCard variant="inline" icon="audit" label="Events" value={formatNumber(auditStats.total)} caption="This period" series={smoothSeries("au-total", 26)} />
        <StatCard variant="inline" icon="clock" label="Today" value={formatNumber(auditStats.today)} caption="Since midnight" series={smoothSeries("au-today", 26)} />
        <StatCard variant="inline" icon="users" label="Actors" value={formatNumber(auditStats.actors)} caption="Distinct" series={smoothSeries("au-actors", 26)} />
        <StatCard variant="inline" icon="shield" label="Admin actions" value={formatNumber(auditStats.adminActions)} caption="Human initiated" series={smoothSeries("au-admin", 26)} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1060}
        searchPlaceholder="Search actor, action or target..."
        unit="events"
      />
    </div>
  );
}
