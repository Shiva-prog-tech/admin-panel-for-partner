"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/Components/Icons/Icon";
import Avatar from "@/Components/Avatar/Avatar";
import useClickOutside from "@/customHooks/useClickOutside";
import useTheme from "@/customHooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPaletteOpen, toggleSidebar } from "@/redux/reducers/configSlice";
import { cx } from "@/utils/helper";

const NOTIFICATIONS = [
  { id: "n1", title: "3 cardholders awaiting review", meta: "KYC queue · 12 min ago", icon: "user" as const },
  { id: "n2", title: "Float balance crossed $1,900", meta: "Treasury · 48 min ago", icon: "wallet" as const },
  { id: "n3", title: "Custody deposit confirmed — 476.27 USDT", meta: "BSC · 2 hours ago", icon: "crypto" as const },
  { id: "n4", title: "API key “Reporting worker” used from a new IP", meta: "Security · 5 hours ago", icon: "key" as const },
];

const MESSAGES = [
  { id: "m1", title: "Swipeo compliance", meta: "Monthly attestation is due Friday", icon: "shield" as const },
  { id: "m2", title: "Issuer processor", meta: "Scheduled maintenance on Aug 3, 01:00 UTC", icon: "info" as const },
  { id: "m3", title: "Amelia K.", meta: "Approved 6 cardholders in the KYC queue", icon: "user" as const },
  { id: "m4", title: "Ops bot", meta: "Weekly settlement report is ready", icon: "audit" as const },
];

export default function Topbar() {
  const dispatch = useAppDispatch();
  const tenant = useAppSelector((state) => state.config.tenant);
  const user = useAppSelector((state) => state.auth.user);
  const { theme, toggle } = useTheme();

  const [panel, setPanel] = useState<"bell" | "mail" | "profile" | null>(null);
  const rightRef = useClickOutside<HTMLDivElement>(panel !== null, () => setPanel(null));

  const togglePanel = (next: "bell" | "mail" | "profile") =>
    setPanel((current) => (current === next ? null : next));

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="topbar__burger"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Open navigation"
        >
          <Icon name="menu" size={18} />
        </button>

        <div>
          <div className="topbar__tenant">
            <span className="topbar__tenant-name">{tenant.name}</span>
            <span className="live-pill">
              {tenant.mode === "live" ? "Live" : "Sandbox"}
            </span>
          </div>
          <div className="topbar__tenant-mail">{tenant.email}</div>
        </div>
      </div>

      <div className="topbar__center">
        <button
          type="button"
          className="omnisearch"
          onClick={() => dispatch(setPaletteOpen(true))}
        >
          <Icon name="search" size={17} />
          <span className="omnisearch__label">Search anything...</span>
          <span className="omnisearch__kbd">⌘ K</span>
        </button>
      </div>

      <div className="topbar__right" ref={rightRef}>
        <div className="popover">
          <button
            type="button"
            className={cx("tb-btn", panel === "bell" && "tb-btn--is-open")}
            onClick={() => togglePanel("bell")}
            aria-label="Notifications"
            aria-expanded={panel === "bell"}
          >
            <Icon name="bell" size={19} />
            <span className="tb-btn__badge">8</span>
          </button>

          {panel === "bell" && (
            <div className="popover__panel popover__panel--wide" role="menu">
              <div className="popover__title">Notifications</div>
              {NOTIFICATIONS.map((item) => (
                <button type="button" key={item.id} className="menu-item" role="menuitem">
                  <Icon name={item.icon} size={16} />
                  <span>
                    <span style={{ display: "block", color: "var(--text-primary)" }}>
                      {item.title}
                    </span>
                    <span style={{ display: "block", fontSize: 11.5, color: "var(--text-muted)" }}>
                      {item.meta}
                    </span>
                  </span>
                </button>
              ))}
              <div className="popover__divider" />
              <Link href="/audit-log" className="menu-item" role="menuitem">
                <Icon name="arrowRight" size={16} />
                View all activity
              </Link>
            </div>
          )}
        </div>

        <div className="popover">
          <button
            type="button"
            className={cx("tb-btn", panel === "mail" && "tb-btn--is-open")}
            onClick={() => togglePanel("mail")}
            aria-label="Messages"
            aria-expanded={panel === "mail"}
          >
            <Icon name="mail" size={19} />
            <span className="tb-btn__badge">4</span>
          </button>

          {panel === "mail" && (
            <div className="popover__panel popover__panel--wide" role="menu">
              <div className="popover__title">Inbox</div>
              {MESSAGES.map((item) => (
                <button type="button" key={item.id} className="menu-item" role="menuitem">
                  <Icon name={item.icon} size={16} />
                  <span>
                    <span style={{ display: "block", color: "var(--text-primary)" }}>
                      {item.title}
                    </span>
                    <span style={{ display: "block", fontSize: 11.5, color: "var(--text-muted)" }}>
                      {item.meta}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="tb-btn"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={19} />
        </button>

        <div className="popover">
          <button
            type="button"
            className="profile-chip"
            onClick={() => togglePanel("profile")}
            aria-expanded={panel === "profile"}
            aria-label="Account menu"
          >
            <Avatar size={38} name={user?.name ?? "Signed out"} />
            <Icon name="chevronDown" size={16} className="profile-chip__caret" />
          </button>

          {panel === "profile" && (
            <div className="popover__panel" role="menu">
              <div className="popover__title">{user?.email ?? "no session"}</div>
              <Link href="/settings" className="menu-item" role="menuitem">
                <Icon name="user" size={16} />
                Profile
              </Link>
              <Link href="/api-keys" className="menu-item" role="menuitem">
                <Icon name="key" size={16} />
                API keys
              </Link>
              <Link href="/settings" className="menu-item" role="menuitem">
                <Icon name="settings" size={16} />
                Settings
              </Link>
              <div className="popover__divider" />
              <button type="button" className="menu-item menu-item--danger" role="menuitem">
                <Icon name="logout" size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
