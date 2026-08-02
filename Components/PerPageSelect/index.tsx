"use client";

import Icon from "@/Components/Icons";
import { PAGE_SIZES } from "@/types/constants";
import styles from "@/Components/Select/Select.module.scss";

interface PerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export default function PerPageSelect({ value, onChange }: PerPageSelectProps) {
  return (
    <span className={styles.select}>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Rows per page"
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={15} className={styles.caret} />
    </span>
  );
}
