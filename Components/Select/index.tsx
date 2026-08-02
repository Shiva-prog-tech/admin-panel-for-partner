"use client";

import Icon from "@/Components/Icons";
import { cx } from "@/utils/helper";
import styles from "./Select.module.scss";

export interface SelectItem {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  items: readonly SelectItem[] | readonly string[];
  /** omit to render the control without a label (toolbar filters) */
  label?: string;
  /** stretch to the container — used inside modal form rows */
  block?: boolean;
  /** 42px control instead of the 38px toolbar height */
  tall?: boolean;
  ariaLabel?: string;
  className?: string;
}

function normalise(
  items: readonly SelectItem[] | readonly string[]
): SelectItem[] {
  return items.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item
  );
}

/**
 * Labelled native select. Native is deliberate: it gets platform keyboard
 * behaviour, mobile pickers and screen-reader support for free, and the
 * screenshots show the OS dropdown.
 */
export default function Select({
  id,
  value,
  onChange,
  items,
  label,
  block = false,
  tall = false,
  ariaLabel,
  className,
}: SelectProps) {
  const control = (
    <span
      className={cx(
        styles.select,
        tall && styles.tall,
        block && styles.block,
        className
      )}
    >
      <select
        id={id}
        value={value}
        aria-label={ariaLabel ?? label}
        onChange={(event) => onChange(event.target.value)}
      >
        {normalise(items).map((item) => (
          <option key={item.value || "all"} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={15} className={styles.caret} />
    </span>
  );

  if (!label) return control;

  return (
    <div>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {control}
    </div>
  );
}
