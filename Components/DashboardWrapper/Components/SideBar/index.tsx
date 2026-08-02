"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/Components/Icons";
import BrandMark from "@/Components/Icons/BrandMark";
import SidebarWaves from "@/Components/Icons/SidebarWaves";
import Avatar from "@/Components/Avatar/NameAvatar";
import useClickOutside from "@/customHooks/useClickOutside";
import { dropdownStyles } from "@/Components/Dropdown";
import ProfileDropdown from "@/modules/ProfileDropdownModule";
import useSignOut from "@/customHooks/useSignOut";
import { useAppSelector } from "@/redux/hooks";
import { APP_NAME, APP_TAGLINE, NAV_ITEMS } from "@/types/constants";
import { cx } from "@/utils/helper";
import styles from "./SideBar.module.scss";

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({ open, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const signOut = useSignOut();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(menuOpen, () => setMenuOpen(false));

  return (
    <aside className={cx(styles.sidebar, open && styles.open)}>
      <div className={styles.brand}>
        <BrandMark size={34} className={styles.logo} />
        <div className="u-grow">
          <div className={styles.name}>{APP_NAME}</div>
          <div className={styles.tagline}>{APP_TAGLINE}</div>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(styles.navItem, active && styles.navItemActive)}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon name={item.icon as IconName} size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <SidebarWaves className={styles.waves} />

      <div className={styles.footer}>
        <div className={dropdownStyles.root} ref={menuRef} style={{ display: "block" }}>
          <button
            type="button"
            className={styles.userChip}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <Avatar size={36} name={user?.name ?? "Signed out"} />
            <span className={styles.userMeta}>
              <span className={styles.userName}>{user?.name ?? "Signed out"}</span>
              <span className={styles.userRole}>{user?.role ?? "—"}</span>
            </span>
            <Icon
              name={menuOpen ? "chevronUp" : "chevronDown"}
              size={16}
              className={styles.userCaret}
            />
          </button>

          {menuOpen && (
            <div
              className={cx(dropdownStyles.panel, dropdownStyles.panelLeft, dropdownStyles.panelWide)}
              style={{ bottom: "calc(100% + 8px)", top: "auto" }}
              role="menu"
            >
              <ProfileDropdown
                user={user}
                variant="sidebar"
                onNavigate={onNavigate}
                onSignOut={() => { setMenuOpen(false); void signOut(); }}
              />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
