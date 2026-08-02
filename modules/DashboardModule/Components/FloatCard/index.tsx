"use client";

import Link from "next/link";
import Icon from "@/Components/Icons";
import Badge from "@/Components/Badge";
import AreaChart from "@/Components/Charts/AreaChart";
import type { FloatSummary } from "@/types/global";
import { formatMoney, formatMoneyPlain } from "@/utils/helper";
import { buttonStyles } from "@/Components/Button";
import { panelStyles } from "@/Components/PanelCard";
import styles from "./FloatCard.module.scss";

/** "USD float" card — headline balance, ledger link and the 7-day area chart. */
export default function FloatCard({ float }: { float: FloatSummary }) {
  // The spec highlights the peak (May 28) rather than the trailing point.
  const peakIndex = float.series.reduce(
    (best, point, index, all) => (point.value > all[best].value ? index : best),
    0
  );

  return (
    <section className={panelStyles.card}>
      <h2 className={panelStyles.title}>{float.currency} float</h2>

      <div className={styles.value}>
        <span className={styles.amount}>{formatMoneyPlain(float.amount)}</span>
        <Badge tone="success" uppercase>
          {float.status.toUpperCase()}
        </Badge>
      </div>

      <div className={styles.link}>
        <Link href="/float" className={buttonStyles.linkBrand}>
          View ledger
          <Icon name="arrowRight" size={15} />
        </Link>
      </div>

      <div className={styles.chart}>
        <AreaChart
          points={float.series}
          height={236}
          defaultIndex={peakIndex}
          formatValue={(value) => formatMoney(value)}
        />
      </div>
    </section>
  );
}
