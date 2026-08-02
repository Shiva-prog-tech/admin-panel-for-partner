"use client";

import PageHeader from "@/Components/PageHeader";
import DateRangePicker from "@/Components/DateRangePicker";
import StatCard from "@/Components/StatCard";
import type { IconName } from "@/Components/Icons";
import FloatCard from "./Components/FloatCard";
import OpsHealthCard from "./Components/OpsHealthCard";
import QuickLinks from "./Components/QuickLinks";
import { useAppSelector } from "@/redux/hooks";
import { dashboardData } from "@/utils/mockData/dashboard";
import { listingStyles } from "@/Components/ListingPage";
import styles from "./DashboardModule.module.scss";

export default function Dashboard() {
  const tenant = useAppSelector((state) => state.config.tenant);
  const { tiles, float, custody, webhookIssues } = dashboardData;

  return (
    <div className={styles.dashboard}>
      <PageHeader
        title="Dashboard"
        subtitle={`${tenant.name} · ${tenant.environmentLabel}`}
        actions={<DateRangePicker />}
      />

      <div className={listingStyles.stats}>
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

      <div className={styles.row}>
        <FloatCard float={float} />
        <OpsHealthCard webhookIssues={webhookIssues} balances={custody} />
      </div>

      <div className={styles.quick}>
        <QuickLinks />
      </div>
    </div>
  );
}
