"use client";

import Icon from "@/Components/Icons/Icon";
import { cx } from "@/utils/helper";

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
    <label className={cx("search-field", wide && "search-field--wide", className)}>
      <Icon name="search" size={16} className="search-field__icon" />
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
