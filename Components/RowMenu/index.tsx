"use client";

import { useState } from "react";
import Icon, { type IconName } from "@/Components/Icons";
import Dropdown, { dropdownStyles } from "@/Components/Dropdown";
import { cx } from "@/utils/helper";
import styles from "./RowMenu.module.scss";

export interface RowAction {
  label: string;
  icon: IconName;
  danger?: boolean;
  onSelect: () => void;
}

/** The trailing "…" cell menu present on every listing row. */
export default function RowMenu({ actions }: { actions: RowAction[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      open={open}
      onClose={() => setOpen(false)}
      role="menu"
      trigger={
        <button
          type="button"
          className={cx(styles.trigger, open && styles.open)}
          onClick={() => setOpen((v) => !v)}
          aria-label="Row actions"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <Icon name="more" size={18} />
        </button>
      }
    >
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          role="menuitem"
          className={cx(dropdownStyles.item, action.danger && dropdownStyles.itemDanger)}
          onClick={() => {
            setOpen(false);
            action.onSelect();
          }}
        >
          <Icon name={action.icon} size={16} />
          {action.label}
        </button>
      ))}
    </Dropdown>
  );
}
