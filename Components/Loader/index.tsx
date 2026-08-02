import { cx } from "@/utils/helper";
import styles from "./Loader.module.scss";

interface LoaderProps {
  label?: string;
  size?: "sm" | "lg";
  block?: boolean;
  className?: string;
}

export default function Loader({
  label,
  size = "sm",
  block = false,
  className,
}: LoaderProps) {
  const spinner = (
    <span className={cx(styles.spinner, size === "lg" && styles.spinnerLg)} />
  );

  if (!block) return spinner;

  return (
    <div className={cx(styles.block, className)} role="status" aria-live="polite">
      {spinner}
      {label && <span>{label}</span>}
    </div>
  );
}

/** Row placeholders used while a table is fetching. */
export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div style={{ padding: "14px 18px", display: "grid", gap: 10 }}>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className={styles.skeleton}
          style={{ height: 20, opacity: 1 - i * 0.06 }}
        />
      ))}
    </div>
  );
}

/**
 * Spinner class for call sites that cannot render <Loader /> — the auth submit
 * buttons position it absolutely inside the button.
 */
export const loaderStyles = { spinner: styles.spinner } as const;
