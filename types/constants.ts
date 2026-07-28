// ===========================================================================
// Static app constants — navigation, status maps, table defaults
// ===========================================================================
import type {
  BadgeTone,
  DateRange,
  NavItem,
} from "./global";

export const APP_NAME = "Partner Portal";
export const APP_TAGLINE = "Swipeo tenant backoffice";

/** Sidebar order matches the product spec exactly. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "End users", href: "/end-users", icon: "users" },
  { label: "Cardholders", href: "/cardholders", icon: "user" },
  { label: "Cards", href: "/cards", icon: "card" },
  { label: "Transactions", href: "/transactions", icon: "transactions" },
  { label: "Card orders", href: "/card-orders", icon: "package" },
  { label: "Float", href: "/float", icon: "wallet" },
  { label: "Custody", href: "/custody", icon: "custody" },
  { label: "Crypto txs", href: "/crypto-txs", icon: "crypto" },
  { label: "Webhooks", href: "/webhooks", icon: "webhook" },
  { label: "API keys", href: "/api-keys", icon: "key" },
  { label: "Audit log", href: "/audit-log", icon: "audit" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

export const QUICK_LINKS: NavItem[] = [
  { label: "End users", href: "/end-users", icon: "users" },
  { label: "Card transactions", href: "/transactions", icon: "card" },
  { label: "Crypto transactions", href: "/crypto-txs", icon: "diamond" },
  { label: "API keys", href: "/api-keys", icon: "key" },
  { label: "Webhooks", href: "/webhooks", icon: "webhook" },
  { label: "Audit log", href: "/audit-log", icon: "audit" },
];

export const PAGE_SIZES = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

/** Maps every record status in the panel onto a badge tone. */
export const STATUS_TONES: Record<string, BadgeTone> = {
  // end users
  Active: "success",
  Invited: "info",
  Suspended: "danger",
  Closed: "neutral",
  // cardholders / KYC
  Approved: "success",
  Rejected: "danger",
  Pending: "warning",
  // cards
  Frozen: "info",
  Terminated: "neutral",
  // transactions
  Settled: "success",
  Declined: "danger",
  Reversed: "warning",
  // card orders
  Delivered: "success",
  Shipped: "info",
  "In production": "warning",
  Requested: "neutral",
  Cancelled: "danger",
  // crypto
  Confirmed: "success",
  Failed: "danger",
  // webhooks
  Healthy: "success",
  Degraded: "warning",
  Failing: "danger",
  Paused: "neutral",
  // api keys
  Revoked: "neutral",
  // float
  ACTIVE: "success",
  FROZEN: "info",
};

/** Presets for the header date-range control. */
export const DATE_RANGES: DateRange[] = [
  { id: "7d", label: "May 22, 2025 - May 29, 2025", from: "2025-05-22", to: "2025-05-29" },
  { id: "14d", label: "May 15, 2025 - May 29, 2025", from: "2025-05-15", to: "2025-05-29" },
  { id: "30d", label: "Apr 29, 2025 - May 29, 2025", from: "2025-04-29", to: "2025-05-29" },
  { id: "90d", label: "Feb 28, 2025 - May 29, 2025", from: "2025-02-28", to: "2025-05-29" },
  { id: "ytd", label: "Jan 1, 2025 - May 29, 2025", from: "2025-01-01", to: "2025-05-29" },
];

export const DEFAULT_RANGE_ID = "7d";

export const END_USER_STATUSES = [
  "Active",
  "Invited",
  "Suspended",
  "Closed",
] as const;

export const CARDHOLDER_STATUSES = ["Approved", "Rejected", "Pending"] as const;

export const REJECTION_REASONS = [
  "An issue was detected with the document and verification",
  "The applicant uploaded screenshots instead of photos",
  "The type of residence permit is not supported",
  "The document has expired",
  "Selfie does not match the submitted document",
] as const;

export const SETTINGS_TABS = [
  { id: "general", label: "General", icon: "settings" },
  { id: "team", label: "Team", icon: "users" },
  { id: "branding", label: "Branding", icon: "diamond" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "security", label: "Security", icon: "shield" },
] as const;
