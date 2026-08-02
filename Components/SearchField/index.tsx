"use client";

import Icon from "@/Components/Icons";
import { cx } from "@/utils/helper";
import styles from "./SearchField.module.scss";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  wide?: boolean;
  className?: string;
}

export default function SearchField({
  value,
  onChange,
  placeholder = "Search ref ID...",
  wide = false,
  className,
}: SearchFieldProps) {
  return (
    <label className={cx(styles.field, wide && styles.wide, className)}>
      <Icon name="search" size={16} className={styles.icon} />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-label={placeholder}
      />
    </label>
  );
}
