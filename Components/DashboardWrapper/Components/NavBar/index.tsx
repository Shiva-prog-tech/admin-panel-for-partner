"use client";

import { useState } from "react";
import Icon from "@/Components/Icons";
import Avatar from "@/Components/Avatar/NameAvatar";
import useClickOutside from "@/customHooks/useClickOutside";
import { dropdownStyles } from "@/Components/Dropdown";
import selectStyles from "@/Components/Select/Select.module.scss";
import NotificationDropdown, { type NotificationItem } from "@/modules/notificationdropdown";
import ProfileDropdown from "@/modules/ProfileDropdownModule";
import useSignOut from "@/customHooks/useSignOut";
import useTheme from "@/customHooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setEnvironment,
  setPaletteOpen,
  toggleSidebar,
} from "@/redux/reducers/ConfigReducer";
import { pushToast } from "@/redux/reducers/ToastReducer";
import { ENVIRONMENTS } from "@/types/constants";
import type { Environment } from "@/types/global";
import { cx } from "@/utils/helper";
import styles from "./NavBar.module.scss";

const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "3 cardholders awaiting review", meta: "KYC queue · 12 min ago", icon: "user" as const },
  { id: "n2", title: "Float balance crossed $1,900", meta: "Treasury · 48 min ago", icon: "wallet" as const },
  { id: "n3", title: "Custody deposit confirmed — 476.27 USDT", meta: "BSC · 2 hours ago", icon: "crypto" as const },
  { id: "n4", title: "API key “Reporting worker” used from a new IP", meta: "Security · 5 hours ago", icon: "key" as const },
];

const MESSAGES: NotificationItem[] = [
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
  const signOut = useSignOut();

  const [panel, setPanel] = useState<"bell" | "mail" | "profile" | null>(null);
  const rightRef = useClickOutside<HTMLDivElement>(panel !== null, () => setPanel(null));

  const togglePanel = (next: "bell" | "mail" | "profile") =>
    setPanel((current) => (current === next ? null : next));

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.burger}
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Open navigation"
        >
          <Icon name="menu" size={18} />
        </button>

        <div>
          <div className={styles.tenant}>
            <span className={styles.tenantName}>{tenant.name}</span>
            <span className={styles.livePill}>
              {tenant.mode === "live" ? "Live" : "Sandbox"}
            </span>
          </div>
          <div className={styles.tenantMail}>{tenant.email}</div>
        </div>
      </div>

      <div className={styles.center}>
        <button
          type="button"
          className={styles.omnisearch}
          onClick={() => dispatch(setPaletteOpen(true))}
        >
          <Icon name="search" size={17} />
          <span className={styles.omnisearchLabel}>Search anything...</span>
          <span className={styles.kbd}>⌘ K</span>
        </button>
      </div>

      <div className={styles.right} ref={rightRef}>
        <div className={dropdownStyles.root}>
          <button
            type="button"
            className={cx(styles.tbBtn, panel === "bell" && styles.tbBtnOpen)}
            onClick={() => togglePanel("bell")}
            aria-label="Notifications"
            aria-expanded={panel === "bell"}
          >
            <Icon name="bell" size={19} />
            <span className={styles.badge}>8</span>
          </button>

          {panel === "bell" && (
            <div className={cx(dropdownStyles.panel, dropdownStyles.panelWide)} role="menu">
              <NotificationDropdown
                title="Notifications"
                items={NOTIFICATIONS}
                footer={{ label: "View all activity", href: "/audit-log" }}
              />
            </div>
          )}
        </div>

        <div className={dropdownStyles.root}>
          <button
            type="button"
            className={cx(styles.tbBtn, panel === "mail" && styles.tbBtnOpen)}
            onClick={() => togglePanel("mail")}
            aria-label="Messages"
            aria-expanded={panel === "mail"}
          >
            <Icon name="mail" size={19} />
            <span className={styles.badge}>4</span>
          </button>

          {panel === "mail" && (
            <div className={cx(dropdownStyles.panel, dropdownStyles.panelWide)} role="menu">
              <NotificationDropdown title="Inbox" items={MESSAGES} />
            </div>
          )}
        </div>

        <button
          type="button"
          className={styles.tbBtn}
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={19} />
        </button>

        <span className={cx(selectStyles.select, selectStyles.tall, styles.envSelect)}>
          <select
            value={tenant.mode}
            aria-label="Environment"
            onChange={(event) => {
              const next = event.target.value as Environment;
              dispatch(setEnvironment(next));
              dispatch(
                pushToast({
                  tone: next === "live" ? "brand" : "info",
                  title: `Switched to ${next === "live" ? "Live" : "Sandbox"}`,
                  text:
                    next === "live"
                      ? "You are now acting on production records."
                      : "Sandbox records are isolated from production.",
                })
              );
            }}
          >
            {ENVIRONMENTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" size={15} className={selectStyles.caret} />
        </span>

        <button
          type="button"
          className={styles.tbBtn}
          aria-label="Sign out"
          title="Sign out"
          onClick={() => void signOut()}
        >
          <Icon name="logout" size={19} />
        </button>

        <div className={dropdownStyles.root}>
          <button
            type="button"
            className={styles.profileChip}
            onClick={() => togglePanel("profile")}
            aria-expanded={panel === "profile"}
            aria-label="Account menu"
          >
            <Avatar size={38} name={user?.name ?? "Signed out"} />
            <Icon name="chevronDown" size={16} className={styles.profileCaret} />
          </button>

          {panel === "profile" && (
            <div className={dropdownStyles.panel} role="menu">
              <ProfileDropdown user={user} onSignOut={() => { setPanel(null); void signOut(); }} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
