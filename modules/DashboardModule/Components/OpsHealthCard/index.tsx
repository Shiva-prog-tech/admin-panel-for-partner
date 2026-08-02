import Link from "next/link";
import Icon from "@/Components/Icons";
import CoinIcon from "@/Components/CoinIcon";
import EcgLine from "@/Components/Charts/EcgLine";
import type { CustodyBalance } from "@/types/global";
import { cx, formatNumber } from "@/utils/helper";
import { buttonStyles } from "@/Components/Button";
import { panelStyles } from "@/Components/PanelCard";
import styles from "./OpsHealthCard.module.scss";

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
    <section className={cx(panelStyles.card, panelStyles.divided)}>
      <EcgLine className={styles.ecg} />

      <div className={panelStyles.head}>
        <h2 className={panelStyles.title}>Operations health</h2>
      </div>

      <div className={styles.row}>
        <span className={styles.rowLabel}>
          Webhook issues (7d)
          <span className={styles.okDot} title="No failing endpoints">
            <Icon name="checkCircle" size={15} />
          </span>
        </span>
        <span className={styles.rowValue}>{formatNumber(webhookIssues)}</span>
      </div>

      <h3 className={styles.sectionTitle}>Custody balances</h3>

      <div>
        {balances.map((balance) => (
          <div className={styles.balance} key={balance.id}>
            <span className={styles.balanceLeft}>
              <CoinIcon symbol={balance.symbol} size={22} />
              <span className={styles.symbol}>{balance.symbol}</span>
            </span>
            <span className={styles.amount}>{balance.amount}</span>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <Link href="/custody" className={buttonStyles.linkBrand}>
          Custody details
          <Icon name="arrowRight" size={15} />
        </Link>
      </div>
    </section>
  );
}
