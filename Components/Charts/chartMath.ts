// ===========================================================================
// Shared geometry for the SVG charts
// ===========================================================================

export interface Pt {
  x: number;
  y: number;
}

export interface Scale {
  min: number;
  max: number;
}

/** Maps values onto pixel positions inside a box. */
export function project(
  values: number[],
  box: { x: number; y: number; w: number; h: number },
  scale?: Scale
): Pt[] {
  const min = scale?.min ?? Math.min(...values);
  const max = scale?.max ?? Math.max(...values);
  const span = max - min || 1;
  const step = values.length > 1 ? box.w / (values.length - 1) : 0;

  return values.map((value, i) => ({
    x: box.x + step * i,
    y: box.y + box.h - ((value - min) / span) * box.h,
  }));
}

/** Straight polyline path — used for the jagged sparklines. */
export function linePath(points: Pt[]): string {
  if (!points.length) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${round(p.x)} ${round(p.y)}`)
    .join(" ");
}

/**
 * Catmull-Rom → cubic bezier. Tension is kept below 1 so the curve hugs the
 * data instead of overshooting above the plotted maximum.
 */
export function smoothPath(points: Pt[], tension = 0.82): string {
  if (points.length < 2) return linePath(points);

  let d = `M${round(points[0].x)} ${round(points[0].y)}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1 = {
      x: p1.x + ((p2.x - p0.x) / 6) * tension,
      y: p1.y + ((p2.y - p0.y) / 6) * tension,
    };
    const c2 = {
      x: p2.x - ((p3.x - p1.x) / 6) * tension,
      y: p2.y - ((p3.y - p1.y) / 6) * tension,
    };

    d += ` C${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(p2.x)} ${round(p2.y)}`;
  }

  return d;
}

/** Closes a line path down to the baseline so it can be filled. */
export function areaPath(path: string, points: Pt[], baseline: number): string {
  if (!points.length) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${path} L${round(last.x)} ${round(baseline)} L${round(first.x)} ${round(baseline)} Z`;
}

/** Nice round axis ticks between 0 and max. */
export function axisTicks(max: number, count = 4): number[] {
  const step = max / count;
  return Array.from({ length: count + 1 }, (_, i) => Number((step * i).toFixed(4)));
}

/** Rounds up to a friendly axis ceiling (600 → 600, 1924 → 2400). */
export function niceCeiling(max: number, divisions = 4): number {
  if (max <= 0) return divisions;
  const rough = max / divisions;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const candidates = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 10];
  const stepUnit =
    candidates.find((c) => c * magnitude >= rough) ?? 10;
  return stepUnit * magnitude * divisions;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
