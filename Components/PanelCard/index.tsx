import type { ReactNode } from "react";
import { cx } from "@/utils/helper";
import styles from "./PanelCard.module.scss";

interface PanelCardProps {
  children: ReactNode;
  /** rule under the header — for list bodies rather than charts */
  divided?: boolean;
  /** drop the padding, e.g. when the body is a full-bleed table */
  flush?: boolean;
  className?: string;
}

export default function PanelCard({
  children,
  divided = false,
  flush = false,
  className,
}: PanelCardProps) {
  return (
    <section
      className={cx(styles.card, divided && styles.divided, flush && styles.flush, className)}
    >
      {children}
    </section>
  );
}

/**
 * Chrome as class names. Several modules build their own header row (extra
 * buttons, badges, decorative SVG) rather than accepting a `title` prop, so the
 * parts are exported instead of wrapped.
 */
export const panelStyles = {
  card: styles.card,
  divided: styles.divided,
  flush: styles.flush,
  head: styles.head,
  title: styles.title,
  sub: styles.sub,
  sectionTitle: styles.sectionTitle,
} as const;
