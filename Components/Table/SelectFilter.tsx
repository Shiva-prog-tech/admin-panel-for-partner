"use client";

import Icon from "@/Components/Icons/Icon";
import type { SelectOption } from "@/types/global";
import { cx } from "@/utils/helper";

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** accessible name — the first option doubles as the visible placeholder */
  label: string;
  className?: string;
}

/**
 * Independent dropdown filter. Several of these sit side by side on the
 * transaction, custody and ledger screens (asset / direction / reason), which
 * a single multi-select popover cannot express.
 */
export default function SelectFilter({
  value,
  onChange,
  options,
  label,
  className,
}: SelectFilterProps) {
  const active = value !== "";

  return (
    <span className={cx("select", "select--tall", active && "select--active", className)}>
      <select
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={15} className="select__caret" />
    </span>
  );
}
