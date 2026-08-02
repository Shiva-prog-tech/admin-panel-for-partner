import { cx } from "@/utils/helper";
import styles from "./EcgLine.module.scss";

/**
 * Ornamental heartbeat trace for the "Operations health" card — a healthy
 * baseline with one strong QRS complex.
 */
export default function EcgLine({ className }: { className?: string }) {
  const d = [
    "M0 46",
    "H22",
    "c4 0 6-3 8-8 s4 8 8 8",
    "H58",
    "c3 0 5-2 7-6 s4 6 7 6",
    "H84",
    "l6 0",
    "l5 -40",
    "l6 74",
    "l6 -60",
    "l5 26",
    "H124",
    "c4 0 6-4 9-10 s5 10 9 10",
    "H166",
    "l5 -18",
    "l6 32",
    "l5 -22",
    "l4 8",
    "H210",
    "c4 0 6-3 8-7 s4 7 8 7",
    "H248",
  ].join(" ");

  return (
    <svg
      className={cx(styles.ecg, className)}
      viewBox="0 0 248 92"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.line} d={d} />
    </svg>
  );
}
