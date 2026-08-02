import Icon, { type IconName } from "@/Components/Icons";
import Sparkline from "@/Components/Charts/Sparkline";
import type { Delta } from "@/types/global";
import { cx, formatSigned } from "@/utils/helper";
import styles from "./StatCard.module.scss";

interface StatCardProps {
  label: string;
  value: string;
  icon: IconName;
  /** "stacked" = dashboard tile (delta + full-width spark)
   *  "inline"  = listing tile (caption + right-hand spark) */
  variant?: "stacked" | "inline";
  caption?: string;
  delta?: Delta;
  series?: number[];
  /** smooth curve instead of the jagged dashboard trace */
  smooth?: boolean;
  /** shrink the headline for long composite values (e.g. custody totals) */
  valueScale?: "md" | "sm" | "xs";
  className?: string;
}

// Interpolated BEM modifiers become explicit lookups once the class names are
// hashed — `styles[`value--${scale}`]` would silently resolve to undefined.
const VARIANT = {
  stacked: styles.stacked,
  inline: styles.inline,
} as const;

const VALUE_SCALE = {
  md: undefined,
  sm: styles.valueSm,
  xs: styles.valueXs,
} as const;

const DELTA_TONE = {
  up: styles.deltaUp,
  down: styles.deltaDown,
} as const;

export default function StatCard({
  label,
  value,
  icon,
  variant = "stacked",
  caption,
  delta,
  series,
  smooth,
  valueScale = "md",
  className,
}: StatCardProps) {
  const inline = variant === "inline";

  return (
    <article className={cx(styles.stat, VARIANT[variant], className)}>
      <div className={styles.top}>
        <span className={styles.icon}>
          <Icon name={icon} size={21} />
        </span>

        <div className={styles.meta}>
          <div className={styles.label}>{label}</div>
          <div className={cx(styles.value, VALUE_SCALE[valueScale])}>{value}</div>
          {inline && caption && <div className={styles.caption}>{caption}</div>}
        </div>

        {inline && series && series.length > 1 && (
          <div className={styles.sparkInline}>
            <Sparkline data={series} height={38} smooth={smooth ?? true} />
          </div>
        )}
      </div>

      {!inline && caption && <div className={styles.caption}>{caption}</div>}

      {!inline && delta && (
        <div className={cx(styles.delta, DELTA_TONE[delta.direction])}>
          <Icon name={delta.direction === "up" ? "arrowUp" : "arrowDown"} size={14} />
          <strong>{formatSigned(delta.value)}</strong>
          <span>{delta.label}</span>
        </div>
      )}

      {!inline && series && series.length > 1 && (
        <div className={styles.spark}>
          <Sparkline data={series} height={44} smooth={smooth ?? false} />
        </div>
      )}
    </article>
  );
}
