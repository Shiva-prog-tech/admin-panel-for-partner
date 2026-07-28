// ===========================================================================
// Authentication + session service
// ===========================================================================
import http, { setToken } from "@/utils/axios";
import { DEFAULT_ADMIN } from "@/utils/Config";
import type { AdminUser } from "@/types/global";

export interface LoginPayload {
  email: string;
  password: string;
  otp?: string;
}

export interface Session {
  token: string;
  user: AdminUser;
  expiresAt: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<Session> {
    const { data } = await http.post<Session>("/auth/login", payload);
    setToken(data.token);
    return data;
  },

  async session(): Promise<Session | null> {
    try {
      const { data } = await http.get<Session>("/auth/session");
      return data;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await http.post("/auth/logout");
    } finally {
      setToken(null);
    }
  },

  /** Local fallback used while the backoffice API is not wired up. */
  currentUserFallback(): AdminUser {
    return DEFAULT_ADMIN;
  },
};

export default authService;
