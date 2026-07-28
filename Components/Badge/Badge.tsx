import type { ReactNode } from "react";
import type { BadgeTone } from "@/types/global";
import { STATUS_TONES } from "@/types/constants";
import { cx } from "@/utils/helper";

interface BadgeProps {
  children: ReactNode;
  /** explicit tone; otherwise derived from the label via STATUS_TONES */
  tone?: BadgeTone;
  uppercase?: boolean;
  dot?: boolean;
  className?: string;
}

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
        "badge",
        `badge--${resolved}`,
        uppercase && "badge--upper",
        dot && "badge--dot",
        className
      )}
    >
      {children}
    </span>
  );
}
