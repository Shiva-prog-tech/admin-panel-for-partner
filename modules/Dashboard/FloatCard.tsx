"use client";

import Link from "next/link";
import Icon from "@/Components/Icons/Icon";
import Badge from "@/Components/Badge/Badge";
import AreaChart from "@/Components/Charts/AreaChart";
import type { FloatSummary } from "@/types/global";
import { formatMoney, formatMoneyPlain } from "@/utils/helper";

/** "USD float" card — headline balance, ledger link and the 7-day area chart. */
export default function FloatCard({ float }: { float: FloatSummary }) {
  // The spec highlights the peak (May 28) rather than the trailing point.
  const peakIndex = float.series.reduce(
    (best, point, index, all) => (point.value > all[best].value ? index : best),
    0
  );

  return (
    <section className="panel-card float-card">
      <h2 className="panel-card__title">{float.currency} float</h2>

      <div className="float-card__value u-mt-sm">
        <span className="float-card__amount">{formatMoneyPlain(float.amount)}</span>
        <Badge tone="success" uppercase>
          {float.status.toUpperCase()}
        </Badge>
      </div>

      <div className="float-card__link">
        <Link href="/float" className="link-brand">
          View ledger
          <Icon name="arrowRight" size={15} />
        </Link>
      </div>

      <div className="float-card__chart">
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
