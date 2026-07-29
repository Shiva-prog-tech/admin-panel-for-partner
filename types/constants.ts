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
export const END_USER_STATUSES = [
  "Active",
  "Invited",
  "Suspended",
  "Closed",
] as const;

export const CARDHOLDER_STATUSES = ["Approved", "Pending", "Rejected"] as const;

export const CARD_STATUSES = ["Normal", "Pending", "Frozen"] as const;

export const TX_TYPE_OPTIONS: SelectOption[] = [
  { value: "", label: "All types" },
  { value: "purchase", label: "Purchase" },
  { value: "refund", label: "Refund" },
  { value: "auth", label: "Authorization" },
];

export const TX_STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All statuses" },
  { value: "Success", label: "Success" },
  { value: "Pending", label: "Pending" },
  { value: "Failed", label: "Failed" },
];

/** "Authorized" rows belong to the Success bucket when filtering. */
export const TX_STATUS_BUCKETS: Record<string, string[]> = {
  Success: ["Success", "Authorized"],
  Pending: ["Pending"],
  Failed: ["Failed"],
};

export const CARD_ORDER_STATUSES = ["Pending", "Shipped", "Delivered"] as const;

export const CRYPTO_ASSET_OPTIONS: SelectOption[] = [
  { value: "", label: "All assets" },
  { value: "USDT", label: "USDT" },
  { value: "USDC", label: "USDC" },
  { value: "TRX", label: "TRX" },
  { value: "BTC", label: "BTC" },
  { value: "ETH", label: "ETH" },
];

export const DIRECTION_OPTIONS: SelectOption[] = [
  { value: "", label: "All" },
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Debit" },
];

export const CRYPTO_REASON_OPTIONS: SelectOption[] = [
  { value: "", label: "All reasons" },
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "settlement", label: "Settlement" },
  { value: "refund", label: "Refund" },
];

export const WITHDRAWAL_STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Processing", label: "Processing" },
  { value: "Approved", label: "Approved" },
  { value: "Completed", label: "Completed" },
  { value: "Failed", label: "Failed" },
];

export const CUSTODY_ASSET_OPTIONS: SelectOption[] = [
  { value: "", label: "All assets" },
  { value: "USDT", label: "USDT" },
  { value: "USDC", label: "USDC" },
  { value: "TRX", label: "TRX" },
  { value: "BTC", label: "BTC" },
];

export const JOURNAL_REASON_OPTIONS: SelectOption[] = [
  { value: "", label: "All reasons" },
  { value: "prefund", label: "Prefund" },
  { value: "crypto_settlement", label: "Crypto settlement" },
  { value: "card_topup", label: "Card top-up" },
  { value: "card_topup_refund", label: "Card top-up refund" },
  { value: "card_issuance", label: "Card issuance" },
];

export const DELIVERY_STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All" },
  { value: "Delivered", label: "Delivered" },
  { value: "Failed", label: "Failed" },
  { value: "Pending", label: "Pending" },
];

export const API_STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All" },
  { value: "2xx", label: "2xx" },
  { value: "400", label: "400" },
  { value: "401", label: "401" },
  { value: "500", label: "500" },
];

/** Assets and chains offered by the custody → float converter. */
export const CONVERT_ASSETS = ["BTC", "ETH", "USDT", "USDC", "TRX", "MATIC"] as const;
export const CONVERT_CHAINS = ["eth", "tron", "polygon"] as const;

export const REJECTION_REASONS = [
  "An issue was detected with the document and verification could not be completed",
  "The applicant uploaded screenshots instead of photos or scans.  |  [PASSPORT] The applicant uploaded screenshots instead of photos",
  "The type of residence permit is not supported.",
  "The document has expired.",
  "[SELFIE] The selfie does not match the submitted document.",
] as const;

export const CARD_PRODUCTS = ["prod_111059", "prod_111031"] as const;

// ---------------------------------------------------------------------------
// Authentication
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

export const SETTINGS_TABS = [
  { id: "general", label: "General", icon: "settings" },
  { id: "team", label: "Team", icon: "users" },
  { id: "branding", label: "Branding", icon: "diamond" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "security", label: "Security", icon: "shield" },
] as const;
