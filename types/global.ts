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

// --- tenant / session ------------------------------------------------------
export type Environment = "live" | "sandbox";

export interface Tenant {
  id: string;
  name: string;
  email: string;
  mode: Environment;
  environmentLabel: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: string;
  email: string;
}

/** Settings → Profile card */
export interface ProfileInfo {
  name: string;
  email: string;
  role: string;
  environment: string;
}

/** Settings → Organization card */
export interface OrganizationInfo {
  tenant: string;
  slug: string;
  rateLimit: string;
  webhookUrl: string;
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

// --- end users ------------------------------------------------------------
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

// --- cardholders ----------------------------------------------------------
export type CardholderStatus = "Approved" | "Rejected" | "Pending";

export interface Cardholder {
  id: string;
  refId: string;
  product: string;
  status: CardholderStatus;
  /** issuer rejection detail; may contain several " | " separated notes */
  reason: string | null;
  cards: number;
  wallets: number;
  deposited: number | null;
  createdAt: string;
}

// --- cards ----------------------------------------------------------------
export type CardStatus = "Normal" | "Pending" | "Frozen" | "Success";

export interface Card {
  id: string;
  refId: string;
  /** masked PAN, e.g. "•••• •••• •••• 0300"; null before personalisation */
  cardNumberMasked: string | null;
  /** issuer card reference (long WD… number) */
  cardNo: string;
  last4: string | null;
  balance: number | null;
  currency: string;
  product: string;
  status: CardStatus;
  createdAt: string;
}

// --- card transactions ----------------------------------------------------
export type TxType = "auth" | "purchase" | "refund";
export type TxStatus = "Authorized" | "Success" | "Pending" | "Failed";

export interface Transaction {
  id: string;
  refId: string;
  merchant: string;
  amount: number;
  currency: string;
  type: TxType;
  status: TxStatus;
  last4: string | null;
  createdAt: string;
}

// --- physical card orders -------------------------------------------------
export type CardOrderStatus = "Pending" | "Shipped" | "Delivered";

export interface CardOrder {
  id: string;
  /** human order number */
  order: string;
  refId: string;
  status: CardOrderStatus;
  recipient: string;
  country: string;
  tracking: string | null;
  createdAt: string;
}

// --- float ledger ---------------------------------------------------------
export type LedgerDirection = "credit" | "debit";

export type JournalReason =
  | "prefund"
  | "crypto_settlement"
  | "card_topup"
  | "card_topup_refund"
  | "card_issuance";

export interface JournalEntry {
  id: string;
  createdAt: string;
  direction: LedgerDirection;
  /** always USD on the float ledger */
  amount: number;
  reason: JournalReason;
  reference: string | null;
}

export interface ConvertQuote {
  asset: string;
  chain: string;
  amount: number;
  rate: number;
  usd: number;
  feeUsd: number;
  netUsd: number;
}

// --- custody --------------------------------------------------------------
export interface CustodyAssetTile {
  id: string;
  asset: string;
  balance: string;
  clients: number;
}

export interface PoolBalance {
  id: string;
  asset: string;
  chain: string;
  balance: string;
  updatedAt: string;
}

export type WithdrawalStatus =
  | "Pending"
  | "Processing"
  | "Approved"
  | "Completed"
  | "Failed";

export interface CustodyWithdrawal {
  id: string;
  createdAt: string;
  refId: string;
  asset: string;
  amount: string;
  status: WithdrawalStatus;
  reason: string | null;
  /** destination address */
  to: string;
}

export interface FeeSchedule {
  deposit: string;
  withdrawal: string;
  monthly: string;
  approvalRequired: string;
}

// --- crypto transactions --------------------------------------------------
export type CryptoReason = "deposit" | "withdrawal" | "settlement" | "refund";

export interface CryptoTx {
  id: string;
  createdAt: string;
  /** end-user ref, or "_pool" for tenant pool movements */
  refId: string;
  dir: LedgerDirection;
  asset: string;
  chain: string;
  /** raw units as reported by custody, e.g. "47.19999973" */
  amount: string;
  reason: CryptoReason;
  txHash: string | null;
}

// --- webhooks -------------------------------------------------------------
export type DeliveryStatus = "Delivered" | "Failed" | "Pending";

export interface WebhookConfig {
  url: string;
  secretHint: string;
  rotatedAt: string;
}

export interface WebhookDelivery {
  id: string;
  createdAt: string;
  event: string;
  refId: string;
  status: DeliveryStatus;
  attempts: number;
  error: string | null;
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

// --- api keys -------------------------------------------------------------
export type ApiKeyState = "Active" | "Revoked";

export interface ApiKey {
  id: string;
  /** visible key prefix, e.g. "fsk_live_4f054af" */
  prefix: string;
  label: string;
  state: ApiKeyState;
  lastUsed: string | null;
  scope: "read" | "read_write";
  environment: Environment;
  createdAt: string;
}

// --- audit ----------------------------------------------------------------
export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

/** One machine API request against the partner API. */
export interface ApiRequestLog {
  id: string;
  createdAt: string;
  method: HttpMethod;
  path: string;
  status: number;
  refId: string;
  latencyMs: number;
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

export interface SelectOption {
  value: string;
  label: string;
}
