"use client";

import type { ReactNode } from "react";
import Icon from "@/Components/Icons";
import { cx } from "@/utils/helper";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  error?: boolean;
}

/**
 * Native checkbox kept in the accessibility tree and visually replaced, so
 * label clicks, keyboard focus and form semantics all still work.
 */
export default function Checkbox({
  id,
  checked,
  onChange,
  children,
  error,
}: CheckboxProps) {
  return (
    <div className={cx(styles.cbx, error && styles.error)}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label className={styles.label} htmlFor={id}>
        <span className={styles.box} aria-hidden="true">
          {checked && <Icon name="check" size={12} strokeWidth={3} />}
        </span>
        <span className={styles.text}>{children}</span>
      </label>
    </div>
  );
}
