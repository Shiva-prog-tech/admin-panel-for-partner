import Icon, { type IconName } from "@/Components/Icons/Icon";
import Sparkline from "@/Components/Charts/Sparkline";
import type { Delta } from "@/types/global";
import { cx, formatSigned } from "@/utils/helper";

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
    <article className={cx("stat", `stat--${variant}`, className)}>
      <div className="stat__top">
        <span className="stat__icon">
          <Icon name={icon} size={21} />
        </span>

        <div className="stat__meta">
          <div className="stat__label">{label}</div>
          <div
            className={cx(
              "stat__value",
              valueScale !== "md" && `stat__value--${valueScale}`
            )}
          >
            {value}
          </div>
          {inline && caption && <div className="stat__caption">{caption}</div>}
        </div>

        {inline && series && series.length > 1 && (
          <div className="stat__spark-inline">
            <Sparkline data={series} height={38} smooth={smooth ?? true} />
          </div>
        )}
      </div>

      {!inline && caption && <div className="stat__caption">{caption}</div>}

      {!inline && delta && (
        <div className={cx("stat__delta", `stat__delta--${delta.direction}`)}>
          <Icon name={delta.direction === "up" ? "arrowUp" : "arrowDown"} size={14} />
          <strong>{formatSigned(delta.value)}</strong>
          <span>{delta.label}</span>
        </div>
      )}

      {!inline && series && series.length > 1 && (
        <div className="stat__spark">
          <Sparkline data={series} height={44} smooth={smooth ?? false} />
        </div>
      )}
    </article>
  );
}
