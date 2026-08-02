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

// --- cardholders ----------------------------------------------------------

// --- cards ----------------------------------------------------------------

// --- card transactions ----------------------------------------------------

// --- physical card orders -------------------------------------------------

// --- float ledger ---------------------------------------------------------
export type LedgerDirection = "credit" | "debit";

// --- custody --------------------------------------------------------------

// --- crypto transactions --------------------------------------------------

// --- webhooks -------------------------------------------------------------

// --- api keys -------------------------------------------------------------

// --- audit ----------------------------------------------------------------

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
