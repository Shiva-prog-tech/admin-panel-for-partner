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
import useCopyToClipboard from "@/customHooks/useCopyToClipboard";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/toastSlice";
import type { ApiKey, Column } from "@/types/global";
import { apiKeys, apiKeyStats } from "@/utils/mockData/apiKeys";
import { DATASET_NOW } from "@/utils/Config";
import { formatDateLong, formatNumber, relativeFrom, smoothSeries } from "@/utils/helper";

export default function ApiKeys() {
  const dispatch = useAppDispatch();
  const { copy } = useCopyToClipboard();

  const state = useTableState<ApiKey>({
    rows: apiKeys,
    searchFields: (row) => [row.label, row.prefix, row.scope, row.environment, row.state],
    sortValue: (row, key) => (row as unknown as Record<string, string | number>)[key] ?? null,
  });

  const columns: Column<ApiKey>[] = [
    {
      key: "label",
      header: "Label",
      sortable: true,
      render: (row) => (
        <span className="u-row" style={{ gap: 9 }}>
          <Icon name="key" size={16} />
          <span className="dt__strong">{row.label}</span>
        </span>
      ),
    },
    {
      key: "prefix",
      header: "Key",
      render: (row) => (
        <button
          type="button"
          className="dt__mono dt__ref-id"
          onClick={async () => {
            await copy(row.prefix);
            dispatch(
              pushToast({ tone: "success", title: "Key prefix copied", text: row.prefix })
            );
          }}
        >
          {row.prefix}••••••••
        </button>
      ),
    },
    {
      key: "scope",
      header: "Scope",
      sortable: true,
      render: (row) => (
        <Badge tone={row.scope === "read_write" ? "warning" : "neutral"}>
          {row.scope === "read_write" ? "Read / write" : "Read only"}
        </Badge>
      ),
    },
    {
      key: "environment",
      header: "Environment",
      sortable: true,
      render: (row) => (
        <Badge tone={row.environment === "live" ? "success" : "info"}>
          {row.environment === "live" ? "Live" : "Sandbox"}
        </Badge>
      ),
    },
    {
      key: "lastUsed",
      header: "Last used",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) =>
        row.lastUsed ? (
          relativeFrom(row.lastUsed, DATASET_NOW)
        ) : (
          <span className="dt__muted">never</span>
        ),
    },
    { key: "state", header: "State", sortable: true, render: (row) => <Badge>{row.state}</Badge> },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) => formatDateLong(row.createdAt),
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
                label: "Roll key",
                icon: "refresh",
                onSelect: () =>
                  dispatch(
                    pushToast({
                      tone: "success",
                      title: "Key rolled",
                      text: "The previous secret stays valid for 24 hours.",
                    })
                  ),
              },
              {
                label: "View usage",
                icon: "activity",
                onSelect: () =>
                  dispatch(pushToast({ tone: "info", title: "Usage", text: row.label })),
              },
              {
                label: "Revoke key",
                icon: "ban",
                danger: true,
                onSelect: () =>
                  dispatch(pushToast({ tone: "info", title: "Key revoked", text: row.label })),
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
        title="API keys"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "API keys" }]}
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="api-keys.csv"
              rows={state.pageRows}
              columns={[
                { label: "Label", value: (r) => r.label },
                { label: "Prefix", value: (r) => r.prefix },
                { label: "Scope", value: (r) => r.scope },
                { label: "Environment", value: (r) => r.environment },
                { label: "Last used", value: (r) => r.lastUsed },
                { label: "State", value: (r) => r.state },
                { label: "Created", value: (r) => r.createdAt },
              ]}
            />
          </>
        }
      />

      <div className="stat-grid listing__stats">
        <StatCard variant="inline" icon="key" label="Total keys" value={formatNumber(apiKeyStats.total)} caption="All environments" series={smoothSeries("ak-total", 26)} />
        <StatCard variant="inline" icon="checkCircle" label="Active" value={formatNumber(apiKeyStats.active)} caption="Usable now" series={smoothSeries("ak-active", 26)} />
        <StatCard variant="inline" icon="shield" label="Live keys" value={formatNumber(apiKeyStats.live)} caption="Production" series={smoothSeries("ak-live", 26)} />
        <StatCard variant="inline" icon="activity" label="API calls (24h)" value={formatNumber(apiKeyStats.calls24h)} caption="Last 24 hours" series={smoothSeries("ak-calls", 26)} />
      </div>

      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1220}
        searchPlaceholder="Search label or prefix..."
        unit="keys"
        toolbarRight={
          <button
            type="button"
            className="btn btn--brand"
            onClick={() =>
              dispatch(
                pushToast({
                  tone: "info",
                  title: "Create API key",
                  text: "The secret is shown once — store it in your vault immediately.",
                })
              )
            }
          >
            <Icon name="plus" size={17} />
            <span>Create key</span>
          </button>
        }
      />
    </div>
  );
}
