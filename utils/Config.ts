// ===========================================================================
// Runtime configuration — one place that reads process.env
// ===========================================================================
import type { AdminUser, Tenant } from "@/types/global";

const env = (key: string, fallback: string): string => {
  const value = process.env[key];
  return value === undefined || value === "" ? fallback : value;
};

const flag = (key: string, fallback: boolean): boolean => {
  const value = process.env[key];
  if (value === undefined || value === "") return fallback;
  return value === "true" || value === "1";
};

export const Config = {
  env: env("NEXT_PUBLIC_ENV", "development"),
  isProd: env("NEXT_PUBLIC_ENV", "development") === "production",

  appName: env("NEXT_PUBLIC_APP_NAME", "Partner Portal"),
  appTagline: env("NEXT_PUBLIC_APP_TAGLINE", "Swipeo tenant backoffice"),

  api: {
    baseUrl: env("NEXT_PUBLIC_API_BASE_URL", "/api"),
    timeout: Number(env("NEXT_PUBLIC_API_TIMEOUT", "30000")),
  },

  features: {
    mockData: flag("NEXT_PUBLIC_ENABLE_MOCK_DATA", true),
    darkMode: flag("NEXT_PUBLIC_ENABLE_DARK_MODE", true),
  },

  storageKeys: {
    theme: "pap.theme",
    sidebar: "pap.sidebar",
    range: "pap.range",
    pageSize: "pap.pageSize",
  },
} as const;

export const DEFAULT_TENANT: Tenant = {
  id: "tnt_travls_live",
  name: env("NEXT_PUBLIC_TENANT_NAME", "Travls Live"),
  email: env("NEXT_PUBLIC_TENANT_EMAIL", "service@travls.io"),
  mode: env("NEXT_PUBLIC_TENANT_MODE", "live") === "live" ? "live" : "sandbox",
  environmentLabel: "live environment",
};

export const DEFAULT_ADMIN: AdminUser = {
  id: "usr_admin_1",
  name: "John Doe",
  role: "Administrator",
  email: "john.doe@travls.io",
};

/** Reference "now" for the seeded dataset, so relative labels stay stable. */
export const DATASET_NOW = "2026-07-29T10:00:00";
