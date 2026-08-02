"use client";

import { useMemo, useState } from "react";
import type { SeriesPoint } from "@/types/global";
import { areaPath, axisTicks, niceCeiling, project, smoothPath } from "../chartMath";
import { cx, formatCompactMoney, formatMoney, hashSeed } from "@/utils/helper";
import styles from "./AreaChart.module.scss";

interface AreaChartProps {
  points: SeriesPoint[];
  height?: number;
  /** index highlighted before the pointer touches the chart */
  defaultIndex?: number;
  formatValue?: (value: number) => string;
  formatTick?: (value: number) => string;
  divisions?: number;
  className?: string;
}

const VB_W = 720;

/**
 * Filled area chart with axis ticks, a dashed cursor and a floating tooltip.
 * Everything is laid out in a fixed 720-unit viewBox and scaled to the
 * container, which keeps the tooltip anchoring in simple percentages.
 */
export default function AreaChart({
  points,
  height = 232,
  defaultIndex,
  formatValue = (v) => formatMoney(v),
  formatTick = (v) => formatCompactMoney(v),
  divisions = 4,
  className,
}: AreaChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const geometry = useMemo(() => {
    const values = points.map((p) => p.value);
    const max = niceCeiling(Math.max(...values, 1), divisions);
    const box = { x: 52, y: 14, w: VB_W - 52 - 14, h: height - 14 - 30 };
    const projected = project(values, box, { min: 0, max });
    const line = smoothPath(projected);

    return {
      max,
      box,
      projected,
      line,
      area: areaPath(line, projected, box.y + box.h),
      ticks: axisTicks(max, divisions),
    };
  }, [points, height, divisions]);

  const fallbackIndex =
    defaultIndex ?? (points.length ? points.length - 1 : 0);
  const activeIndex = hoverIndex ?? fallbackIndex;
  const active = geometry.projected[activeIndex];
  const activePoint = points[activeIndex];

  const gradientId = `pa-area-${hashSeed(
    `${points.length}:${points[0]?.value ?? 0}:${height}`
  )}`;

  const handleMove = (event: React.MouseEvent<SVGRectElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * (points.length - 1));
    setHoverIndex(Math.max(0, Math.min(points.length - 1, index)));
  };

  return (
    <div className={cx(styles.chart, className)}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VB_W} ${height}`}
        role="img"
        aria-label="Balance over time"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-line)" stopOpacity="0.26" />
            <stop offset="72%" stopColor="var(--chart-line)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--chart-line)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* horizontal grid + y ticks */}
        {geometry.ticks.map((tick) => {
          const y =
            geometry.box.y +
            geometry.box.h -
            (tick / geometry.max) * geometry.box.h;
          return (
            <g key={tick}>
              <line
                className={styles.grid}
                x1={geometry.box.x}
                x2={geometry.box.x + geometry.box.w}
                y1={y}
                y2={y}
              />
              <text className={styles.yLabel} x={geometry.box.x - 12} y={y}>
                {formatTick(tick)}
              </text>
            </g>
          );
        })}

        <path d={geometry.area} fill={`url(#${gradientId})`} />
        <path className={styles.line} d={geometry.line} />

        {/* x labels */}
        {points.map((point, i) => (
          <text
            key={`${point.label}-${i}`}
            className={styles.xLabel}
            x={geometry.projected[i].x}
            y={height - 8}
          >
            {point.label}
          </text>
        ))}

        {/* cursor + marker */}
        {active && (
          <>
            <line
              className={styles.cursor}
              x1={active.x}
              x2={active.x}
              y1={geometry.box.y}
              y2={geometry.box.y + geometry.box.h}
            />
            <circle className={styles.dot} cx={active.x} cy={active.y} r="4.5" />
          </>
        )}

        <rect
          className={styles.hit}
          x={geometry.box.x}
          y={geometry.box.y}
          width={geometry.box.w}
          height={geometry.box.h}
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIndex(null)}
        />
      </svg>

      {active && activePoint && (
        <div
          className={styles.tip}
          style={{
            left: `${(active.x / VB_W) * 100}%`,
            top: `${((active.y - 16) / height) * 100}%`,
          }}
        >
          <div className={styles.tipValue}>{formatValue(activePoint.value)}</div>
          <div className={styles.tipLabel}>{activePoint.label}</div>
        </div>
      )}
    </div>
  );
}
