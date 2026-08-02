import type { ReactNode } from "react";
import { cx } from "@/utils/helper";
import styles from "./Tag.module.scss";

/** Small bordered chip — webhook events, card schemes, the environment label. */
export default function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cx(styles.tag, className)}>{children}</span>;
}

/** For call sites that already build their own span inside a `render()`. */
export const tagStyles = { tag: styles.tag } as const;
