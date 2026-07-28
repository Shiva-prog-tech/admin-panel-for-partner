"use client";

import { useState } from "react";
import Icon, { type IconName } from "@/Components/Icons/Icon";
import useClickOutside from "@/customHooks/useClickOutside";
import { cx } from "@/utils/helper";

export interface RowAction {
  label: string;
  icon: IconName;
  danger?: boolean;
  onSelect: () => void;
}

/** The trailing "…" cell menu present on every listing row. */
export default function RowMenu({ actions }: { actions: RowAction[] }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(open, () => setOpen(false));

  return (
    <div className="popover" ref={ref}>
      <button
        type="button"
        className={cx("icon-action", open && "icon-action--is-open")}
        onClick={() => setOpen((v) => !v)}
        aria-label="Row actions"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Icon name="more" size={18} />
      </button>

      {open && (
        <div className="popover__panel" role="menu">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              className={cx("menu-item", action.danger && "menu-item--danger")}
              onClick={() => {
                setOpen(false);
                action.onSelect();
              }}
            >
              <Icon name={action.icon} size={16} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
