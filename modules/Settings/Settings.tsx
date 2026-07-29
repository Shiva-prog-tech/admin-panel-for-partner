"use client";

import { useState } from "react";
import PageHeader from "@/Components/PageHeader/PageHeader";
import Icon, { type IconName } from "@/Components/Icons/Icon";
import Badge from "@/Components/Badge/Badge";
import Avatar from "@/Components/Avatar/Avatar";
import DetailGrid from "@/Components/DetailGrid/DetailGrid";
import useTheme from "@/customHooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/toastSlice";
import { SETTINGS_TABS } from "@/types/constants";
import { Config } from "@/utils/Config";
import { organizationInfo, profileInfo } from "@/utils/mockData/settings";
import { cx } from "@/utils/helper";

type TabId = (typeof SETTINGS_TABS)[number]["id"];

interface RowProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

function Row({ label, hint, children }: RowProps) {
  return (
    <div className="setting-row">
      <div>
        <div className="setting-row__label">{label}</div>
        {hint && <p className="setting-row__hint">{hint}</p>}
      </div>
      <div className="setting-row__control">{children}</div>
    </div>
  );
}

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={cx("toggle", on && "toggle--on")}
      onClick={() => onChange(!on)}
    />
  );
}

export default function Settings() {
  const dispatch = useAppDispatch();
  const tenant = useAppSelector((state) => state.config.tenant);
  const user = useAppSelector((state) => state.auth.user);
  const { theme, setTheme } = useTheme();

  const [tab, setTab] = useState<TabId>("general");
  const [flags, setFlags] = useState({
    autoFreeze: true,
    requireOtp: true,
    kycAlerts: true,
    weeklyDigest: false,
    sandboxBanner: true,
    ipAllowlist: false,
  });

  const setFlag = (key: keyof typeof flags) => (next: boolean) => {
    setFlags((current) => ({ ...current, [key]: next }));
    dispatch(
      pushToast({
        tone: "success",
        title: "Setting saved",
        text: `${key} is now ${next ? "on" : "off"}`,
      })
    );
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        crumbs={[{ label: "Dashboard", href: "/" }, { label: "Settings" }]}
        actions={
          <button
            type="button"
            className="btn btn--brand"
            onClick={() =>
              dispatch(
                pushToast({ tone: "success", title: "All changes saved", text: tenant.name })
              )
            }
          >
            <Icon name="check" size={17} />
            <span>Save changes</span>
          </button>
        }
      />

      <div className="settings">
        <nav className="settings__nav" aria-label="Settings sections">
          {SETTINGS_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cx("settings__tab", tab === item.id && "settings__tab--active")}
              onClick={() => setTab(item.id)}
            >
              <Icon name={item.icon as IconName} size={17} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="settings__panels">
          {tab === "general" && (
            <>
              <section className="panel-card panel-card--divided">
                <div className="panel-card__head">
                  <div>
                    <h2 className="panel-card__title">Profile</h2>
                    <p className="panel-card__sub">
                      The account you are signed in as.
                    </p>
                  </div>
                  <Avatar size={36} name={profileInfo.name} />
                </div>

                <DetailGrid
                  columns={1}
                  items={[
                    { label: "Name", value: profileInfo.name },
                    { label: "Email", value: profileInfo.email },
                    { label: "Role", value: profileInfo.role },
                    { label: "Environment", value: profileInfo.environment },
                  ]}
                />
              </section>

              <section className="panel-card panel-card--divided">
                <div className="panel-card__head">
                  <div>
                    <h2 className="panel-card__title">Organization</h2>
                    <p className="panel-card__sub">
                      Issued by Swipeo — read-only.
                    </p>
                  </div>
                  <Icon name="building" size={18} className="u-muted" />
                </div>

                <DetailGrid
                  columns={1}
                  items={[
                    { label: "Tenant", value: organizationInfo.tenant },
                    { label: "Slug", value: organizationInfo.slug, mono: true },
                    { label: "Rate limit", value: organizationInfo.rateLimit },
                    {
                      label: "Webhook URL",
                      value: organizationInfo.webhookUrl,
                      mono: true,
                    },
                  ]}
                />
              </section>

              <section className="panel-card panel-card--divided">
                <div className="panel-card__head">
                  <div>
                    <h2 className="panel-card__title">Tenant</h2>
                    <p className="panel-card__sub">
                      How this workspace identifies itself across the API and the panel.
                    </p>
                  </div>
                  <Badge tone={tenant.mode === "live" ? "success" : "info"} uppercase>
                    {tenant.mode}
                  </Badge>
                </div>

                <Row label="Display name" hint="Shown in the top bar and on exported reports.">
                  <span className="field__control" style={{ width: 260 }}>
                    <input defaultValue={tenant.name} aria-label="Display name" />
                  </span>
                </Row>

                <Row label="Support email" hint="End users see this address in card decline messages.">
                  <span className="field__control" style={{ width: 260 }}>
                    <input defaultValue={tenant.email} aria-label="Support email" />
                  </span>
                </Row>

                <Row
                  label="Sandbox banner"
                  hint="Show a persistent banner whenever the panel is pointed at sandbox."
                >
                  <Toggle
                    on={flags.sandboxBanner}
                    onChange={setFlag("sandboxBanner")}
                    label="Sandbox banner"
                  />
                </Row>
              </section>

              <section className="panel-card panel-card--divided">
                <div className="panel-card__head">
                  <h2 className="panel-card__title">Appearance</h2>
                </div>

                <Row label="Theme" hint="Applies to this browser only.">
                  <div className="u-row" style={{ gap: 8 }}>
                    <button
                      type="button"
                      className={cx("btn", theme === "light" ? "btn--brand" : "btn--ghost", "btn--sm")}
                      onClick={() => setTheme("light")}
                    >
                      <Icon name="sun" size={15} />
                      Light
                    </button>
                    <button
                      type="button"
                      className={cx("btn", theme === "dark" ? "btn--brand" : "btn--ghost", "btn--sm")}
                      onClick={() => setTheme("dark")}
                    >
                      <Icon name="moon" size={15} />
                      Dark
                    </button>
                  </div>
                </Row>

                <Row label="Environment" hint="Read from NEXT_PUBLIC_ENV at build time.">
                  <span className="tag">{Config.env}</span>
                </Row>
              </section>
            </>
          )}

          {tab === "team" && (
            <section className="panel-card panel-card--divided">
              <div className="panel-card__head">
                <div>
                  <h2 className="panel-card__title">Team</h2>
                  <p className="panel-card__sub">Who can sign in to this backoffice.</p>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() =>
                    dispatch(
                      pushToast({ tone: "info", title: "Invite teammate", text: "Enter a work email." })
                    )
                  }
                >
                  <Icon name="plus" size={15} />
                  Invite
                </button>
              </div>

              <Row label={user?.name ?? "—"} hint={user?.email}>
                <div className="u-row" style={{ gap: 10 }}>
                  <Badge tone="warning">{user?.role ?? "—"}</Badge>
                  <Avatar size={32} name={user?.name} />
                </div>
              </Row>

              <Row label="Amelia Karim" hint="amelia.k@travls.io">
                <div className="u-row" style={{ gap: 10 }}>
                  <Badge tone="neutral">Compliance</Badge>
                  <Avatar size={32} name="Amelia Karim" />
                </div>
              </Row>

              <Row label="Ops bot" hint="ops.bot@travls.io · machine account">
                <div className="u-row" style={{ gap: 10 }}>
                  <Badge tone="info">Automation</Badge>
                  <Avatar size={32} name="Ops bot" />
                </div>
              </Row>
            </section>
          )}

          {tab === "branding" && (
            <section className="panel-card panel-card--divided">
              <div className="panel-card__head">
                <h2 className="panel-card__title">Branding</h2>
              </div>

              <Row label="Accent colour" hint="Used for primary actions, links and charts.">
                <div className="u-row" style={{ gap: 8 }}>
                  {["#dfa124", "#2775ca", "#16a34a", "#7c3aed"].map((colour) => (
                    <span
                      key={colour}
                      title={colour}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background: colour,
                        border: "1px solid var(--border-strong)",
                        display: "inline-block",
                      }}
                    />
                  ))}
                </div>
              </Row>

              <Row label="Card artwork" hint="PNG or SVG, 1024×648, under 2 MB.">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() =>
                    dispatch(pushToast({ tone: "info", title: "Upload artwork", text: "Pick a file." }))
                  }
                >
                  <Icon name="upload" size={15} />
                  Upload
                </button>
              </Row>
            </section>
          )}

          {tab === "notifications" && (
            <section className="panel-card panel-card--divided">
              <div className="panel-card__head">
                <h2 className="panel-card__title">Notifications</h2>
              </div>

              <Row label="KYC decision alerts" hint="Email whenever a cardholder is approved or rejected.">
                <Toggle on={flags.kycAlerts} onChange={setFlag("kycAlerts")} label="KYC alerts" />
              </Row>

              <Row label="Weekly digest" hint="Monday summary of volume, declines and float movement.">
                <Toggle on={flags.weeklyDigest} onChange={setFlag("weeklyDigest")} label="Weekly digest" />
              </Row>

              <Row
                label="Auto-freeze on suspicion"
                hint="Freeze a card automatically after three declines in five minutes."
              >
                <Toggle on={flags.autoFreeze} onChange={setFlag("autoFreeze")} label="Auto freeze" />
              </Row>
            </section>
          )}

          {tab === "security" && (
            <section className="panel-card panel-card--divided">
              <div className="panel-card__head">
                <h2 className="panel-card__title">Security</h2>
              </div>

              <Row label="Require OTP for sign-in" hint="Applies to every human account in this workspace.">
                <Toggle on={flags.requireOtp} onChange={setFlag("requireOtp")} label="Require OTP" />
              </Row>

              <Row label="IP allowlist" hint="Restrict API traffic to a fixed set of egress addresses.">
                <Toggle on={flags.ipAllowlist} onChange={setFlag("ipAllowlist")} label="IP allowlist" />
              </Row>

              <Row label="Active sessions" hint="Sign out every other browser signed in as you.">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() =>
                    dispatch(
                      pushToast({ tone: "success", title: "Other sessions revoked", text: "1 session ended" })
                    )
                  }
                >
                  <Icon name="logout" size={15} />
                  Revoke others
                </button>
              </Row>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
