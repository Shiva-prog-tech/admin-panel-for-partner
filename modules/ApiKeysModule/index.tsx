"use client";

import PageHeader from "@/Components/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker";
import StatCard from "@/Components/StatCard";
import TableCard from "@/Components/Table/Table_V2";
import ExportButton from "@/Components/ExportButton";
import Badge from "@/Components/Badge";
import Icon from "@/Components/Icons";
import useTableState from "@/customHooks/useTableState";
import useCopyToClipboard from "@/customHooks/useCopyToClipboard";
import { useAppDispatch } from "@/redux/hooks";
import { openPopup } from "@/redux/reducers/PopUpsReducer";
import { pushToast } from "@/redux/reducers/ToastReducer";
import type { Column } from "@/types/global";
import type { ApiKey } from "./types";
import { apiKeys, apiKeyStats } from "@/mockData/apiKeys";
import { DATASET_NOW } from "@/utils/Config";
import { cx, formatDateTimeNumeric, formatNumber, relativeFrom, smoothSeries } from "@/utils/helper";
import { buttonStyles } from "@/Components/Button";
import { panelStyles } from "@/Components/PanelCard";
import { listingStyles } from "@/Components/ListingPage";

export default function ApiKeys() {
  const dispatch = useAppDispatch();
  const { copy } = useCopyToClipboard();

  const state = useTableState<ApiKey>({
    rows: apiKeys,
    searchFields: (row) => [row.prefix, row.label, row.scope, row.environment, row.state],
    sortValue: (row, key) =>
      (row as unknown as Record<string, string | number | null>)[key] ?? null,
  });

  const columns: Column<ApiKey>[] = [
    {
      key: "prefix",
      header: "Prefix",
      sortable: true,
      render: (row) => (
        <span className="u-row" style={{ gap: 8 }}>
          <Icon name="key" size={15} />
          <button
            type="button"
            className="dt__mono dt__ref-id"
            title="Copy key prefix"
            onClick={async () => {
              await copy(row.prefix);
              dispatch(
                pushToast({ tone: "success", title: "Key prefix copied", text: row.prefix })
              );
            }}
          >
            {row.prefix}
          </button>
        </span>
      ),
    },
    {
      key: "label",
      header: "Label",
      sortable: true,
      render: (row) => <span className="dt__strong">{row.label}</span>,
    },
    { key: "state", header: "Status", sortable: true, render: (row) => <Badge>{row.state}</Badge> },
    {
      key: "lastUsed",
      header: "Last used",
      sortable: true,
      cellClassName: "dt__nowrap",
      render: (row) =>
        row.lastUsed ? (
          <span title={relativeFrom(row.lastUsed, DATASET_NOW)}>
            {formatDateTimeNumeric(row.lastUsed)}
          </span>
        ) : (
          <span className="dt__muted">never</span>
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
      key: "action",
      header: "",
      align: "right",
      headerClassName: "dt__action",
      cellClassName: "dt__action",
      render: (row) =>
        row.state === "Revoked" ? (
          <span className="dt__muted">—</span>
        ) : (
          <button
            type="button"
            className={buttonStyles.linkDanger}
            onClick={() => dispatch(openPopup({ name: "confirmRevoke", subject: row.prefix }))}
          >
            Revoke
          </button>
        ),
    },
  ];

  return (
    <div className={listingStyles.page}>
      <PageHeader
        title="API keys"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "API keys" }]}
        subtitle="Credentials your integration uses to call the partner API"
        actions={
          <>
            <DateRangePicker />
            <ExportButton
              filename="api-keys.csv"
              rows={state.pageRows}
              columns={[
                { label: "Prefix", value: (r) => r.prefix },
                { label: "Label", value: (r) => r.label },
                { label: "Status", value: (r) => r.state },
                { label: "Last used", value: (r) => r.lastUsed },
                { label: "Scope", value: (r) => r.scope },
                { label: "Environment", value: (r) => r.environment },
                { label: "Created", value: (r) => r.createdAt },
              ]}
            />
          </>
        }
      />

      <div className={listingStyles.stats}>
        <StatCard variant="inline" icon="key" label="Total keys" value={formatNumber(apiKeyStats.total)} caption="All environments" series={smoothSeries("ak-total", 26)} />
        <StatCard variant="inline" icon="checkCircle" label="Active" value={formatNumber(apiKeyStats.active)} caption="Usable now" series={smoothSeries("ak-active", 26)} />
        <StatCard variant="inline" icon="shield" label="Live keys" value={formatNumber(apiKeyStats.live)} caption="Production" series={smoothSeries("ak-live", 26)} />
        <StatCard variant="inline" icon="activity" label="API calls (24h)" value={formatNumber(apiKeyStats.calls24h)} caption="Machine API traffic" series={smoothSeries("ak-calls", 26)} />
      </div>

      <h2 className={panelStyles.sectionTitle}>Keys</h2>
      <TableCard
        state={state}
        columns={columns}
        rowKey={(row) => row.id}
        minWidth={1180}
        searchPlaceholder="Search prefix or label..."
        unit="keys"
        toolbarRight={
          <button
            type="button"
            className={cx(buttonStyles.btn, buttonStyles.brand)}
            onClick={() =>
              dispatch(
                pushToast({
                  tone: "info",
                  title: "Create key",
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
