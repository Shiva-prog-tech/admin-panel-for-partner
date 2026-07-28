// ===========================================================================
// Shared axios instance — auth header injection + normalised errors
// ===========================================================================
import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { Config } from "./Config";

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}

const TOKEN_KEY = "pap.token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable — nothing to do */
  }
}

const http: AxiosInstance = axios.create({
  baseURL: Config.api.baseUrl,
  timeout: Config.api.timeout,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ code?: string; message?: string; details?: unknown }>) => {
    const normalised: ApiError = {
      status: error.response?.status ?? 0,
      code: error.response?.data?.code ?? error.code ?? "network_error",
      message:
        error.response?.data?.message ??
        error.message ??
        "Something went wrong. Please try again.",
      details: error.response?.data?.details,
    };

    if (normalised.status === 401) {
      setToken(null);
    }

    return Promise.reject(normalised);
  }
);

export default http;
