// ===========================================================================
// Domain + UI types shared across the panel
// ===========================================================================

export type Theme = "light" | "dark";

export type BadgeTone =
  | "success"
  | "info"
  | "danger"
  | "warning"
  | "neutral";

export type SortDir = "asc" | "desc";

export interface SortState {
  key: string;
  dir: SortDir;
}

export interface Column<T> {
  /** unique column id, also used as the sort key */
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  width?: string;
  /** cell renderer; falls back to `String(row[key])` */
  render?: (row: T, rowIndex: number) => React.ReactNode;
  /** value used for sorting / searching when it differs from the rendered cell */
  accessor?: (row: T) => string | number | null | undefined;
  headerClassName?: string;
  cellClassName?: string;
}

// --- tenant ---------------------------------------------------------------
export interface Tenant {
  id: string;
  name: string;
  email: string;
  mode: "live" | "sandbox";
  environmentLabel: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: string;
  email: string;
}

// --- dashboard ------------------------------------------------------------
export interface Delta {
  value: number;
  direction: "up" | "down";
  label: string;
}

export interface MetricTile {
  id: string;
  label: string;
  value: string;
  icon: string;
  caption?: string;
  delta?: Delta;
  series: number[];
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface CustodyBalance {
  id: string;
  symbol: string;
  network: string;
  amount: string;
}

export interface FloatSummary {
  currency: string;
  amount: number;
  status: "active" | "frozen" | "closed";
  series: SeriesPoint[];
}

// --- records --------------------------------------------------------------
export type EndUserStatus = "Active" | "Invited" | "Suspended" | "Closed";

export interface EndUser {
  id: string;
  refId: string;
  cards: number;
  cardholders: number;
  cardTxs: number;
  walletTxs: number;
  deposited: number | null;
  createdAt: string;
  status: EndUserStatus;
}

export type CardholderStatus = "Approved" | "Rejected" | "Pending";

export interface Cardholder {
  id: string;
  refId: string;
  product: string;
  status: CardholderStatus;
  reason: string | null;
  cards: number;
  wallets: number;
  deposited: number | null;
  createdAt: string;
}

export type CardStatus = "Active" | "Frozen" | "Terminated" | "Pending";

export interface Card {
  id: string;
  refId: string;
  last4: string;
  scheme: "Visa" | "Mastercard";
  type: "Virtual" | "Physical";
  cardholderRef: string;
  balance: number;
  spend30d: number;
  status: CardStatus;
  createdAt: string;
}

export type TxStatus = "Settled" | "Pending" | "Declined" | "Reversed";

export interface Transaction {
  id: string;
  refId: string;
  merchant: string;
  mcc: string;
  cardLast4: string;
  amount: number;
  currency: string;
  status: TxStatus;
  createdAt: string;
}

export type CardOrderStatus =
  | "Delivered"
  | "Shipped"
  | "In production"
  | "Requested"
  | "Cancelled";

export interface CardOrder {
  id: string;
  refId: string;
  cardholderRef: string;
  product: string;
  quantity: number;
  destination: string;
  status: CardOrderStatus;
  createdAt: string;
}

export type LedgerDirection = "credit" | "debit";

export interface FloatEntry {
  id: string;
  refId: string;
  description: string;
  direction: LedgerDirection;
  amount: number;
  balanceAfter: number;
  createdAt: string;
}

export type CryptoTxStatus = "Confirmed" | "Pending" | "Failed";

export interface CryptoTx {
  id: string;
  hash: string;
  asset: string;
  network: string;
  direction: "in" | "out";
  amount: string;
  usdValue: number;
  confirmations: number;
  status: CryptoTxStatus;
  createdAt: string;
}

export type WebhookState = "Healthy" | "Degraded" | "Failing" | "Paused";

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  successRate: number;
  lastDelivery: string;
  state: WebhookState;
  createdAt: string;
}

export type ApiKeyState = "Active" | "Revoked";

export interface ApiKey {
  id: string;
  label: string;
  prefix: string;
  scope: "read" | "read_write";
  environment: "live" | "sandbox";
  lastUsed: string | null;
  state: ApiKeyState;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  createdAt: string;
}

// --- ui -------------------------------------------------------------------
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface ToastMessage {
  id: string;
  tone: "success" | "error" | "info" | "brand";
  title: string;
  text?: string;
}

export interface DateRange {
  id: string;
  label: string;
  from: string;
  to: string;
}

export interface Paginated<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}
