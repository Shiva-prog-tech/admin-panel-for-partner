import { areaPath, linePath, project, smoothPath } from "./chartMath";
import { cx, hashSeed } from "@/utils/helper";

interface SparklineProps {
  data: number[];
  height?: number;
  /** smooth = listing tiles, jagged = dashboard tiles */
  smooth?: boolean;
  fill?: boolean;
  strokeWidth?: number;
  className?: string;
}

/**
 * Responsive micro-chart. The viewBox is fixed at 100 units wide and stretched
 * with `preserveAspectRatio="none"`, while the stroke is pinned with
 * `vector-effect` so the line weight never distorts.
 */
export default function Sparkline({
  data,
  height = 40,
  smooth = false,
  fill = true,
  strokeWidth = 1.6,
  className,
}: SparklineProps) {
  if (data.length < 2) return null;

  const pad = strokeWidth;
  const box = { x: 0, y: pad, w: 100, h: height - pad * 2 };
  const points = project(data, box);
  const path = smooth ? smoothPath(points) : linePath(points);
  const gradientId = `pa-spark-${hashSeed(`${data.length}:${data[0]}:${data[data.length - 1]}:${height}`)}`;

  return (
    <svg
      className={cx("spark", className)}
      viewBox={`0 0 100 ${height}`}
      height={height}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {fill && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-line)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--chart-line)" stopOpacity="0" />
          </linearGradient>
        </defs>
      )}

      {fill && (
        <path
          className="spark__area"
          d={areaPath(path, points, height)}
          fill={`url(#${gradientId})`}
        />
      )}

      <path
        className="spark__line"
        d={path}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
