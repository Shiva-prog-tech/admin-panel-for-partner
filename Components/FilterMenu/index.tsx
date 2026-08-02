"use client";

import { useState } from "react";
import Icon from "@/Components/Icons";
import Dropdown, { DropdownDivider, DropdownTitle, dropdownStyles } from "@/Components/Dropdown";
import { cx } from "@/utils/helper";
import { buttonStyles } from "@/Components/Button";
import { tagStyles } from "@/Components/Tag";

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

  return (
    <Dropdown
      open={open}
      onClose={() => setOpen(false)}
      role="menu"
      trigger={
        <button
          type="button"
          className={cx(buttonStyles.btn, buttonStyles.ghost)}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <Icon name="filter" size={16} />
          <span>{label}</span>
          {selected.length > 0 && <span className={tagStyles.tag}>{selected.length}</span>}
          {showCaret && <Icon name="chevronDown" size={15} />}
        </button>
      }
    >
      <DropdownTitle>Status</DropdownTitle>

          {options.map((option) => {
            const on = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                role="menuitemcheckbox"
                aria-checked={on}
                className={cx(dropdownStyles.checkRow, on && dropdownStyles.checkRowOn)}
                onClick={() => onToggle(option)}
              >
                <span className={dropdownStyles.checkBox}>
                  {on && <Icon name="check" size={12} strokeWidth={2.6} />}
                </span>
                <span>{option}</span>
              </button>
            );
          })}

          <DropdownDivider />
          <button
            type="button"
            className={dropdownStyles.item}
            onClick={() => {
              onClear();
              setOpen(false);
            }}
          >
            <Icon name="refresh" size={16} />
        Clear filters
      </button>
    </Dropdown>
  );
}
