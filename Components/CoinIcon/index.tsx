import { coinMeta, type CoinKey } from "@/utils/coins";
import { cx } from "@/utils/helper";
import styles from "./CoinIcon.module.scss";

interface CoinIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

const ASSET: Record<CoinKey, string> = {
  usdt: styles.usdt,
  usdc: styles.usdc,
  trx: styles.trx,
  btc: styles.btc,
  eth: styles.eth,
  generic: styles.generic,
};

/** Round asset chip — brand-coloured with the asset glyph. */
export default function CoinIcon({ symbol, size = 22, className }: CoinIconProps) {
  const meta = coinMeta(symbol);

  return (
    <span
      className={cx(styles.coin, ASSET[meta.key], className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.5) }}
      title={`${meta.symbol} · ${meta.name}`}
      aria-hidden="true"
    >
      {meta.glyph}
    </span>
  );
}
