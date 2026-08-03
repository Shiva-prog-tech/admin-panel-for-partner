// ===========================================================================
// Static app constants — navigation, status maps, filter options, table copy
// ===========================================================================
import type {
  BadgeTone,
  DateRange,
  NavItem,
  SelectOption,
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

/** Environment switcher in the top bar. */
export const ENVIRONMENTS: SelectOption[] = [
  { value: "live", label: "Live" },
  { value: "sandbox", label: "Sandbox" },
];

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
  Normal: "success",
  Frozen: "info",
  Success: "success",
  Terminated: "neutral",
  // card transactions
  Authorized: "success",
  Settled: "success",
  Declined: "danger",
  Failed: "danger",
  Reversed: "warning",
  // card orders
  Delivered: "success",
  Shipped: "info",
  // custody withdrawals
  Processing: "info",
  Completed: "success",
  // crypto
  Confirmed: "success",
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

// ---------------------------------------------------------------------------
// Filter option lists — one per dropdown in the spec
// ---------------------------------------------------------------------------

export const DIRECTION_OPTIONS: SelectOption[] = [
  { value: "", label: "All" },
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Debit" },
];

/** Card products the portal issues against — shared by the cardholder and card fixtures. */
export const CARD_PRODUCTS = ["prod_111059", "prod_111031"] as const;

// ---------------------------------------------------------------------------
// Authentication — read by AuthWrapper, useSignOut and both auth screens
// ---------------------------------------------------------------------------
export const AUTH_ROUTES = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  afterSignIn: "/",
} as const;

export const LANGUAGES: SelectOption[] = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
];

/** Live checklist under the sign-up password field. */
export const PASSWORD_RULES: Array<{ id: string; label: string; test: (v: string) => boolean }> = [
  { id: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { id: "number", label: "Contains a number", test: (v) => /\d/.test(v) },
  { id: "upper", label: "Contains an uppercase letter", test: (v) => /[A-Z]/.test(v) },
];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LEGAL_LINE = "© 2025 Travls.io. All rights reserved.";

