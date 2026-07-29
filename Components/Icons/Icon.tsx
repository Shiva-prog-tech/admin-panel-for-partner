import type { ReactNode, SVGProps } from "react";

/**
 * Single stroked icon set (24×24 grid, 1.6px stroke) so every glyph in the
 * panel shares one optical weight. Add new glyphs to `PATHS` only.
 */
export type IconName =
  | "dashboard"
  | "users"
  | "user"
  | "card"
  | "transactions"
  | "package"
  | "wallet"
  | "custody"
  | "crypto"
  | "webhook"
  | "key"
  | "audit"
  | "settings"
  | "search"
  | "bell"
  | "mail"
  | "moon"
  | "sun"
  | "chevronDown"
  | "chevronUp"
  | "chevronLeft"
  | "chevronRight"
  | "chevronsUpDown"
  | "calendar"
  | "download"
  | "upload"
  | "filter"
  | "plus"
  | "copy"
  | "more"
  | "arrowUp"
  | "arrowDown"
  | "arrowRight"
  | "check"
  | "checkCircle"
  | "activity"
  | "shield"
  | "clock"
  | "diamond"
  | "close"
  | "external"
  | "eye"
  | "eyeOff"
  | "trash"
  | "refresh"
  | "info"
  | "alert"
  | "ban"
  | "snowflake"
  | "send"
  | "link"
  | "globe"
  | "building"
  | "lock"
  | "menu"
  | "logout"
  | "sparkles";

const PATHS: Record<IconName, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <path d="M2 10h20" />
    </>
  ),
  transactions: (
    <>
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </>
  ),
  package: (
    <>
      <path d="m7.5 4.3 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
  wallet: (
    <>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </>
  ),
  custody: (
    <>
      <path d="M2.6 17.4A2 2 0 0 0 2 18.8V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.2a2 2 0 0 0 1.4-.6l.8-.8a6.5 6.5 0 1 0-4-4Z" />
      <circle cx="16.6" cy="7.4" r="1.1" />
    </>
  ),
  crypto: (
    <>
      <path d="m2 9 3.2-3.2L8.4 9" />
      <path d="M13 18H7.2a2 2 0 0 1-2-2V6" />
      <path d="m22 15-3.2 3.2L15.6 15" />
      <path d="M11 6h5.8a2 2 0 0 1 2 2v10" />
    </>
  ),
  webhook: (
    <>
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
      <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
      <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
    </>
  ),
  key: (
    <>
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </>
  ),
  audit: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M15.5 13h-7" />
      <path d="M15.5 17h-7" />
      <path d="M10.5 9h-2" />
    </>
  ),
  settings: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7.5" />
      <path d="m20.5 20.5-4.2-4.2" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4.5" width="20" height="15" rx="2.5" />
      <path d="m21.4 7.2-8.4 5.4a1.9 1.9 0 0 1-2 0L2.6 7.2" />
    </>
  ),
  moon: <path d="M12 3a6.4 6.4 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.9 4.9 1.5 1.5" />
      <path d="m17.6 17.6 1.5 1.5" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.4 17.6-1.5 1.5" />
      <path d="m19.1 4.9-1.5 1.5" />
    </>
  ),
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  chevronUp: <path d="m18 14.5-6-6-6 6" />,
  chevronLeft: <path d="m14.5 18-6-6 6-6" />,
  chevronRight: <path d="m9.5 6 6 6-6 6" />,
  chevronsUpDown: (
    <>
      <path d="m7 14.5 5 5 5-5" />
      <path d="m7 9.5 5-5 5 5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
      <path d="M8 2.5v4" />
      <path d="M16 2.5v4" />
      <path d="M3 10h18" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M12 15V3" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7.5 7.5 4.5-4.5 4.5 4.5" />
      <path d="M12 3v12" />
    </>
  ),
  filter: <path d="M21.5 3.5h-19l7.6 9v6.6l3.8 1.9v-8.5l7.6-9Z" />,
  plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12.5" height="12.5" rx="2.2" />
      <path d="M4.5 15.5A2 2 0 0 1 3 13.5v-9a2 2 0 0 1 2-2h9a2 2 0 0 1 2 1.5" />
    </>
  ),
  more: (
    <g fill="currentColor" stroke="none">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </g>
  ),
  arrowUp: (
    <>
      <path d="m5.5 11.5 6.5-6.5 6.5 6.5" />
      <path d="M12 19V5" />
    </>
  ),
  arrowDown: (
    <>
      <path d="m5.5 12.5 6.5 6.5 6.5-6.5" />
      <path d="M12 5v14" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4.5 12h15" />
      <path d="m13 5.5 6.5 6.5-6.5 6.5" />
    </>
  ),
  check: <path d="M20 6.5 9.4 17 4 11.6" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="m8 12.3 2.7 2.7L16 9.7" />
    </>
  ),
  activity: <path d="M22 12h-4.2l-3 8.5L9.3 3.5l-3 8.5H2" />,
  shield: (
    <>
      <path d="M20 12.8c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C7.5 20.3 4 17.8 4 12.8V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1Z" />
      <path d="m9.2 12.2 2.2 2.2 4-4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 7.2V12l3.4 1.9" />
    </>
  ),
  diamond: (
    <path d="M2.7 10.3a2.4 2.4 0 0 0 0 3.4l7.6 7.6a2.4 2.4 0 0 0 3.4 0l7.6-7.6a2.4 2.4 0 0 0 0-3.4l-7.6-7.6a2.4 2.4 0 0 0-3.4 0Z" />
  ),
  close: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  external: (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  eye: (
    <>
      <path d="M2.2 12S5.8 5.2 12 5.2 21.8 12 21.8 12 18.2 18.8 12 18.8 2.2 12 2.2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M10.7 5.1A10.4 10.4 0 0 1 12 5c6.2 0 9.8 7 9.8 7a13.2 13.2 0 0 1-1.7 2.7" />
      <path d="M6.6 6.6A13.5 13.5 0 0 0 2.2 12S5.8 19 12 19a9.7 9.7 0 0 0 5.4-1.6" />
      <path d="M14.1 14.2a3 3 0 0 1-4.3-4.3" />
      <path d="M2.5 2.5l19 19" />
    </>
  ),
  trash: (
    <>
      <path d="M3.5 6.5h17" />
      <path d="M18.5 6.5V20a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V6.5" />
      <path d="M9 6.5v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M10.5 11v6" />
      <path d="M13.5 11v6" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 16.4V11.4" />
      <path d="M12 8h.01" />
    </>
  ),
  alert: (
    <>
      <path d="m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z" />
      <path d="M12 9.2v4" />
      <path d="M12 17h.01" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="m5.5 5.5 13 13" />
    </>
  ),
  snowflake: (
    <>
      <path d="M12 2v20" />
      <path d="m4.2 7 15.6 10" />
      <path d="m19.8 7L4.2 17" />
      <path d="m9 4.6 3 2.4 3-2.4" />
      <path d="m9 19.4 3-2.4 3 2.4" />
    </>
  ),
  send: (
    <>
      <path d="M21.5 2.5 11 13" />
      <path d="M21.5 2.5 15 21.5l-4-8.5-8.5-4Z" />
    </>
  ),
  link: (
    <>
      <path d="M10 13.5a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7" />
      <path d="M14 10.5a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M2.8 12h18.4" />
      <path d="M12 2.8a15 15 0 0 1 0 18.4 15 15 0 0 1 0-18.4Z" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="2.5" width="16" height="19" rx="2" />
      <path d="M9 7h2" />
      <path d="M13 7h2" />
      <path d="M9 11h2" />
      <path d="M13 11h2" />
      <path d="M10 21.5v-4.5h4v4.5" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10.5" width="16" height="11" rx="2.2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </>
  ),
  menu: (
    <>
      <path d="M3.5 6.5h17" />
      <path d="M3.5 12h17" />
      <path d="M3.5 17.5h17" />
    </>
  ),
  logout: (
    <>
      <path d="M9.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4.5" />
      <path d="m16 16 4-4-4-4" />
      <path d="M20 12H9" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 2.5l1.9 4.9 4.9 1.9-4.9 1.9L12 16.1l-1.9-4.9L5.2 9.3l4.9-1.9Z" />
      <path d="M18.5 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9Z" />
    </>
  ),
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

export default function Icon({
  name,
  size = 18,
  strokeWidth = 1.6,
  ...rest
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
