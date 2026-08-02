"use client";

import type { CSSProperties, ReactNode } from "react";
import useClickOutside from "@/customHooks/useClickOutside";
import { cx } from "@/utils/helper";
import styles from "./Dropdown.module.scss";

interface DropdownProps {
  open: boolean;
  onClose: () => void;
  /** the button that toggles the panel — rendered inside the positioned root */
  trigger: ReactNode;
  children: ReactNode;
  /** which edge the panel is anchored to; defaults to the right */
  align?: "left" | "right";
  wide?: boolean;
  role?: "menu" | "listbox";
  /** escape hatch for the sidebar chip, whose panel opens upwards */
  panelStyle?: CSSProperties;
  className?: string;
}

/**
 * The popover primitive: a positioned root that owns the click-outside/Esc
 * behaviour, plus the panel chrome. Every dropdown in the panel (row actions,
 * filters, locale, the NavBar panels and the sidebar user menu) renders through
 * this, so the chrome is declared exactly once.
 *
 * Items are left to the caller — some are `<button>`, some are `<Link>` — so
 * their class names are exported rather than wrapped.
 */
export default function Dropdown({
  open,
  onClose,
  trigger,
  children,
  align = "right",
  wide = false,
  role,
  panelStyle,
  className,
}: DropdownProps) {
  const ref = useClickOutside<HTMLDivElement>(open, onClose);

  return (
    <div className={cx(styles.root, className)} ref={ref}>
      {trigger}

      {open && (
        <div
          className={cx(
            styles.panel,
            align === "left" && styles.panelLeft,
            wide && styles.panelWide
          )}
          style={panelStyle}
          role={role}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownTitle({ children }: { children: ReactNode }) {
  return <div className={styles.title}>{children}</div>;
}

export function DropdownDivider() {
  return <div className={styles.divider} />;
}

/**
 * Class names for callers that cannot use the component directly.
 *
 * Rows vary by element (`<button>` vs `<Link>`), and the NavBar shares a single
 * click-outside ref across its three panels rather than one per dropdown — so
 * both need the chrome as classes rather than as JSX.
 */
export const dropdownStyles = {
  root: styles.root,
  panel: styles.panel,
  panelLeft: styles.panelLeft,
  panelWide: styles.panelWide,
  title: styles.title,
  divider: styles.divider,
  item: styles.item,
  itemDanger: styles.itemDanger,
  itemCheck: styles.itemCheck,
  checkRow: styles.checkRow,
  checkRowOn: styles.checkRowOn,
  checkBox: styles.checkBox,
} as const;
