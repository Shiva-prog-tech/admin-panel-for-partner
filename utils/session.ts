// ===========================================================================
// Browser session persistence.
//
// "Remember me" decides the backing store: localStorage survives a browser
// restart, sessionStorage dies with the tab. Everything is defensive because
// storage throws in private mode and inside some embedded webviews.
// ===========================================================================
import type { AdminUser } from "@/types/global";

const KEY = "pap.session";

export interface StoredSession {
  user: AdminUser;
  token: string;
  /** ISO timestamp — a stale session is treated as signed out */
  expiresAt: string;
  remember: boolean;
}

function stores(): Storage[] {
  if (typeof window === "undefined") return [];
  const out: Storage[] = [];
  try {
    out.push(window.localStorage);
  } catch {
    /* unavailable */
  }
  try {
    out.push(window.sessionStorage);
  } catch {
    /* unavailable */
  }
  return out;
}

export function readSession(): StoredSession | null {
  for (const store of stores()) {
    try {
      const raw = store.getItem(KEY);
      if (!raw) continue;

      const parsed = JSON.parse(raw) as StoredSession;
      if (!parsed?.user?.email || !parsed.token) continue;

      // Expired sessions are cleared rather than silently trusted.
      if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
        store.removeItem(KEY);
        continue;
      }

      return parsed;
    } catch {
      /* corrupt entry — ignore and fall through */
    }
  }
  return null;
}

export function writeSession(session: StoredSession): void {
  if (typeof window === "undefined") return;
  clearSession();
  try {
    const store = session.remember ? window.localStorage : window.sessionStorage;
    store.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage full or blocked — session stays in memory only */
  }
}

export function clearSession(): void {
  for (const store of stores()) {
    try {
      store.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
}

/** Session lifetime: 30 days when remembered, 12 hours otherwise. */
export function expiryFor(remember: boolean): string {
  const ms = remember ? 30 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000;
  return new Date(Date.now() + ms).toISOString();
}
