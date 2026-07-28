import Link from "next/link";
import Icon from "@/Components/Icons/Icon";
import CoinIcon from "@/Components/Badge/CoinIcon";
import EcgLine from "@/Components/Charts/EcgLine";
import type { CustodyBalance } from "@/types/global";
import { formatNumber } from "@/utils/helper";

interface OpsHealthCardProps {
  webhookIssues: number;
  balances: CustodyBalance[];
}

/** "Operations health" card — webhook health plus live custody balances. */
export default function OpsHealthCard({
  webhookIssues,
  balances,
}: OpsHealthCardProps) {
  return (
    <section className="panel-card panel-card--divided ops-card">
      <EcgLine className="ops-card__ecg" />

      <div className="panel-card__head">
        <h2 className="panel-card__title">Operations health</h2>
      </div>

      <div className="ops-card__row">
        <span className="ops-card__row-label">
          Webhook issues (7d)
          <span className="ok-dot" title="No failing endpoints">
            <Icon name="checkCircle" size={15} />
          </span>
        </span>
        <span className="ops-card__row-value">{formatNumber(webhookIssues)}</span>
      </div>

      <h3 className="ops-card__section-title">Custody balances</h3>

      <div>
        {balances.map((balance) => (
          <div className="balance-row" key={balance.id}>
            <span className="balance-row__left">
              <CoinIcon symbol={balance.symbol} size={22} />
              <span className="balance-row__symbol">{balance.symbol}</span>
            </span>
            <span className="balance-row__amount">{balance.amount}</span>
          </div>
        ))}
      </div>

      <div className="ops-card__footer">
        <Link href="/custody" className="link-brand">
          Custody details
          <Icon name="arrowRight" size={15} />
        </Link>
      </div>
    </section>
  );
}
