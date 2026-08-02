import type { ReactNode } from "react";
import { cx } from "@/utils/helper";
import styles from "./ListingPage.module.scss";

interface ListingPageProps {
  children: ReactNode;
  className?: string;
}

/** Column layout for a record-listing screen: header, stats, table, note. */
export default function ListingPage({ children, className }: ListingPageProps) {
  return <div className={cx(styles.page, className)}>{children}</div>;
}

/** The metric row above the table. `wide` renders three tiles instead of four. */
export function StatGrid({
  children,
  wide = false,
  className,
}: {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <div className={cx(styles.stats, wide && styles.statsWide, className)}>
      {children}
    </div>
  );
}

/** Class names for the modules that compose these rows themselves. */
export const listingStyles = {
  page: styles.page,
  stats: styles.stats,
  statsWide: styles.statsWide,
  note: styles.note,
} as const;
