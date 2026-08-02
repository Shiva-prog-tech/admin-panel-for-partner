"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/utils/helper";
import styles from "./Button.module.scss";

export type ButtonVariant = "brand" | "outline" | "ghost" | "plain" | "danger";
export type ButtonSize = "md" | "sm" | "tall";

const VARIANT: Record<ButtonVariant, string> = {
  brand: styles.brand,
  outline: styles.outline,
  ghost: styles.ghost,
  plain: styles.plain,
  danger: styles.danger,
};

const SIZE: Record<ButtonSize, string | undefined> = {
  md: undefined,
  sm: styles.sm,
  tall: styles.tall,
};

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  children: ReactNode;
  className?: string;
}

export default function Button({
  variant = "ghost",
  size = "md",
  block = false,
  children,
  type = "button",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.btn, VARIANT[variant], SIZE[size], block && styles.block, className)}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * Button chrome as class names, for the cases that are not a `<button>` — the
 * 404's `<Link>`, and the auth submit which needs its own positioning class.
 */
export const buttonStyles = {
  btn: styles.btn,
  brand: styles.brand,
  outline: styles.outline,
  ghost: styles.ghost,
  plain: styles.plain,
  danger: styles.danger,
  sm: styles.sm,
  tall: styles.tall,
  block: styles.block,
  linkBrand: styles.linkBrand,
  linkDanger: styles.linkDanger,
} as const;
