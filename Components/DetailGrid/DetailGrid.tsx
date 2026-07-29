import type { ReactNode } from "react";
import { cx } from "@/utils/helper";

export interface DetailItem {
  label: string;
  value: ReactNode;
  /** render the value in the monospace face (slugs, URLs, ids) */
  mono?: boolean;
}

interface DetailGridProps {
  items: DetailItem[];
  /** fixed column count; defaults to a responsive auto-fit grid */
  columns?: number;
  className?: string;
}

/**
 * Read-only label/value grid — used by Settings (Profile, Organization) and
 * the custody fee schedule.
 */
export default function DetailGrid({ items, columns, className }: DetailGridProps) {
  return (
    <dl
      className={cx("detail-grid", className)}
      style={
        columns
          ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
          : undefined
      }
    >
      {items.map((item) => (
        <div className="detail-item" key={item.label}>
          <dt className="detail-item__label">{item.label}</dt>
          <dd className={cx("detail-item__value", item.mono && "dt__mono")}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
