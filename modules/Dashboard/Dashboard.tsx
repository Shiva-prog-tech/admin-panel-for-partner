"use client";

import PageHeader from "@/Components/PageHeader/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker/DateRangePicker";
import StatCard from "@/Components/StatCard/StatCard";
import type { IconName } from "@/Components/Icons/Icon";
import FloatCard from "./FloatCard";
import OpsHealthCard from "./OpsHealthCard";
import QuickLinks from "./QuickLinks";
import { useAppSelector } from "@/redux/hooks";
import { dashboardData } from "@/utils/mockData/dashboard";

export default function Dashboard() {
  const tenant = useAppSelector((state) => state.config.tenant);
  const { tiles, float, custody, webhookIssues } = dashboardData;

  return (
    <div className="dashboard">
      <PageHeader
        title="Dashboard"
        subtitle={`${tenant.name} · ${tenant.environmentLabel}`}
        actions={<DateRangePicker />}
      />

      <div className="stat-grid">
        {tiles.map((tile) => (
          <StatCard
            key={tile.id}
            label={tile.label}
            value={tile.value}
            icon={tile.icon as IconName}
            variant="stacked"
            caption={tile.caption}
            delta={tile.delta}
            series={tile.series}
          />
        ))}
      </div>

      <div className="dash-row">
        <FloatCard float={float} />
        <OpsHealthCard webhookIssues={webhookIssues} balances={custody} />
      </div>

      <div className="dashboard__quick">
        <QuickLinks />
      </div>
    </div>
  );
}
