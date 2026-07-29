"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/Components/Icons/Icon";
import BrandMark from "@/Components/Icons/BrandMark";
import SidebarWaves from "@/Components/Icons/SidebarWaves";
import Avatar from "@/Components/Avatar/Avatar";
import useClickOutside from "@/customHooks/useClickOutside";
import useSignOut from "@/customHooks/useSignOut";
import { useAppSelector } from "@/redux/hooks";
import { APP_NAME, APP_TAGLINE, NAV_ITEMS } from "@/types/constants";
import { cx } from "@/utils/helper";

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
    <aside className={cx("sidebar", open && "sidebar--open")}>
      <div className="sidebar__brand">
        <BrandMark size={34} className="sidebar__logo" />
        <div className="u-grow">
          <div className="sidebar__name">{APP_NAME}</div>
          <div className="sidebar__tagline">{APP_TAGLINE}</div>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx("nav-item", active && "nav-item--active")}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon name={item.icon as IconName} size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <SidebarWaves className="sidebar__waves" />

      <div className="sidebar__footer">
        <div className="popover" ref={menuRef} style={{ display: "block" }}>
          <button
            type="button"
            className="user-chip"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <Avatar size={36} name={user?.name ?? "Signed out"} />
            <span className="user-chip__meta">
              <span className="user-chip__name">{user?.name ?? "Signed out"}</span>
              <span className="user-chip__role">{user?.role ?? "—"}</span>
            </span>
            <Icon
              name={menuOpen ? "chevronUp" : "chevronDown"}
              size={16}
              className="user-chip__caret"
            />
          </button>

          {menuOpen && (
            <div
              className="popover__panel popover__panel--left popover__panel--wide"
              style={{ bottom: "calc(100% + 8px)", top: "auto" }}
              role="menu"
            >
              <div className="popover__title">{user?.email ?? "no session"}</div>
              <Link href="/settings" className="menu-item" role="menuitem" onClick={onNavigate}>
                <Icon name="user" size={16} />
                Profile
              </Link>
              <Link href="/settings" className="menu-item" role="menuitem" onClick={onNavigate}>
                <Icon name="settings" size={16} />
                Workspace settings
              </Link>
              <Link href="/audit-log" className="menu-item" role="menuitem" onClick={onNavigate}>
                <Icon name="audit" size={16} />
                My activity
              </Link>
              <div className="popover__divider" />
              <button
                type="button"
                className="menu-item menu-item--danger"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  void signOut();
                }}
              >
                <Icon name="logout" size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
