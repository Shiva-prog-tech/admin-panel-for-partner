"use client";

import { useState } from "react";
import Icon from "@/Components/Icons/Icon";
import useClickOutside from "@/customHooks/useClickOutside";
import { cx } from "@/utils/helper";

interface FilterMenuProps {
  /** available status values for this resource */
  options: readonly string[];
  selected: readonly string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  /** the spec shows a bare funnel on End users and a caret on Cardholders */
  showCaret?: boolean;
  label?: string;
}

export default function FilterMenu({
  options,
  selected,
  onToggle,
  onClear,
  showCaret = false,
  label = "Filters",
}: FilterMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(open, () => setOpen(false));

  return (
    <div className="popover" ref={ref}>
      <button
        type="button"
        className="btn btn--ghost"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Icon name="filter" size={16} />
        <span>{label}</span>
        {selected.length > 0 && <span className="tag">{selected.length}</span>}
        {showCaret && <Icon name="chevronDown" size={15} />}
      </button>

      {open && (
        <div className="popover__panel" role="menu">
          <div className="popover__title">Status</div>

          {options.map((option) => {
            const on = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                role="menuitemcheckbox"
                aria-checked={on}
                className={cx("check-row", on && "check-row--on")}
                onClick={() => onToggle(option)}
              >
                <span className="check-row__box">
                  {on && <Icon name="check" size={12} strokeWidth={2.6} />}
                </span>
                <span>{option}</span>
              </button>
            );
          })}

          <div className="popover__divider" />
          <button
            type="button"
            className="menu-item"
            onClick={() => {
              onClear();
              setOpen(false);
            }}
          >
            <Icon name="refresh" size={16} />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
