"use client";

import Link from "next/link";
import Icon from "@/Components/Icons";
import { DropdownDivider, DropdownTitle, dropdownStyles } from "@/Components/Dropdown";
import type { AdminUser } from "@/types/global";
import { cx } from "@/utils/helper";

interface ProfileDropdownProps {
  user: AdminUser | null;
  onSignOut: () => void;
  /** closes the mobile sidebar when a link is followed */
  onNavigate?: () => void;
  /** the sidebar chip shows activity instead of API keys */
  variant?: "navbar" | "sidebar";
}

/**
 * Account menu body, shared by the NavBar profile chip and the SideBar user
 * chip. The popover chrome is supplied by whichever one is rendering it.
 */
export default function ProfileDropdown({
  user,
  onSignOut,
  onNavigate,
  variant = "navbar",
}: ProfileDropdownProps) {
  return (
    <>
      <DropdownTitle>{user?.email ?? "no session"}</DropdownTitle>

      <Link
        href="/settings"
        className={dropdownStyles.item}
        role="menuitem"
        onClick={onNavigate}
      >
        <Icon name="user" size={16} />
        Profile
      </Link>

      {variant === "navbar" ? (
        <Link href="/api-keys" className={dropdownStyles.item} role="menuitem">
          <Icon name="key" size={16} />
          API keys
        </Link>
      ) : (
        <Link
          href="/audit-log"
          className={dropdownStyles.item}
          role="menuitem"
          onClick={onNavigate}
        >
          <Icon name="audit" size={16} />
          My activity
        </Link>
      )}

      <Link
        href="/settings"
        className={dropdownStyles.item}
        role="menuitem"
        onClick={onNavigate}
      >
        <Icon name="settings" size={16} />
        {variant === "navbar" ? "Settings" : "Workspace settings"}
      </Link>

      <DropdownDivider />

      <button
        type="button"
        className={cx(dropdownStyles.item, dropdownStyles.itemDanger)}
        role="menuitem"
        onClick={onSignOut}
      >
        <Icon name="logout" size={16} />
        Sign out
      </button>
    </>
  );
}
