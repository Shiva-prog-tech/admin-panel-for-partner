"use client";

import Link from "next/link";
import Icon, { type IconName } from "@/Components/Icons";
import { DropdownDivider, DropdownTitle, dropdownStyles } from "@/Components/Dropdown";
import styles from "./notificationdropdown.module.scss";

export interface NotificationItem {
  id: string;
  title: string;
  meta: string;
  icon: IconName;
}

interface NotificationDropdownProps {
  title: string;
  items: NotificationItem[];
  /** optional trailing link, e.g. "View all activity" */
  footer?: { label: string; href: string };
}

/**
 * Panel body for the NavBar bell and inbox buttons. The surrounding popover
 * chrome is supplied by the caller, which owns a single click-outside ref
 * shared across all three NavBar panels.
 */
export default function NotificationDropdown({
  title,
  items,
  footer,
}: NotificationDropdownProps) {
  return (
    <>
      <DropdownTitle>{title}</DropdownTitle>

      {items.map((item) => (
        <button type="button" key={item.id} className={dropdownStyles.item} role="menuitem">
          <Icon name={item.icon} size={16} />
          <span>
            <span className={styles.title}>{item.title}</span>
            <span className={styles.meta}>{item.meta}</span>
          </span>
        </button>
      ))}

      {footer && (
        <>
          <DropdownDivider />
          <Link href={footer.href} className={dropdownStyles.item} role="menuitem">
            <Icon name="arrowRight" size={16} />
            {footer.label}
          </Link>
        </>
      )}
    </>
  );
}
