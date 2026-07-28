import { coinMeta } from "@/utils/coins";
import { cx } from "@/utils/helper";

interface CoinIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

/** Round asset chip — brand-coloured with the asset glyph. */
export default function CoinIcon({ symbol, size = 22, className }: CoinIconProps) {
  const meta = coinMeta(symbol);

  return (
    <span
      className={cx("coin", `coin--${meta.key}`, className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.5) }}
      title={`${meta.symbol} · ${meta.name}`}
      aria-hidden="true"
    >
      {meta.glyph}
    </span>
  );
}
