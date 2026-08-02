import type { ReactNode } from "react";
import type { BadgeTone } from "@/types/global";
import { STATUS_TONES } from "@/types/constants";
import { cx } from "@/utils/helper";
import styles from "./Badge.module.scss";

interface BadgeProps {
  children: ReactNode;
  /** explicit tone; otherwise derived from the label via STATUS_TONES */
  tone?: BadgeTone;
  uppercase?: boolean;
  dot?: boolean;
  className?: string;
}

const TONE: Record<BadgeTone, string> = {
  success: styles.success,
  info: styles.info,
  danger: styles.danger,
  warning: styles.warning,
  neutral: styles.neutral,
};

export default function Badge({
  children,
  tone,
  uppercase = false,
  dot = false,
  className,
}: BadgeProps) {
  const resolved: BadgeTone =
    tone ?? STATUS_TONES[String(children)] ?? "neutral";

  return (
    <span
      className={cx(
        styles.badge,
        TONE[resolved],
        uppercase && styles.upper,
        dot && styles.dot,
        className
      )}
    >
      {children}
    </span>
  );
}
