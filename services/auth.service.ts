// ===========================================================================
// Authentication service
//
// With NEXT_PUBLIC_ENABLE_MOCK_DATA=true the credentials are validated locally
// so the panel is usable without a backend. Point NEXT_PUBLIC_API_BASE_URL at
// the real service and flip the flag to hit /auth/* instead — the surface here
// does not change.
// ===========================================================================
import http, { setToken } from "@/utils/axios";
import { Config, DEFAULT_ADMIN } from "@/utils/Config";
import { EMAIL_PATTERN, PASSWORD_RULES } from "@/types/constants";
import { expiryFor, type StoredSession } from "@/utils/session";
import type { AdminUser } from "@/types/global";

export interface SignInPayload {
  email: string;
  password: string;
  remember: boolean;
  otp?: string;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
}

export type Session = StoredSession;

/** Thrown for anything the form should show inline. */
export class AuthError extends Error {
  field?: "email" | "password" | "fullName" | "confirm" | "terms";

  constructor(message: string, field?: AuthError["field"]) {
    super(message);
    this.name = "AuthError";
    this.field = field;
  }
}

function mockToken(email: string): string {
  // Deterministic, obviously-not-a-JWT placeholder. UTF-8 → base64 without
  // the deprecated `unescape` dance.
  let binary = "";
  for (const byte of new TextEncoder().encode(email)) {
    binary += String.fromCharCode(byte);
  }
  return `dev.${btoa(binary).replace(/=+$/, "")}`;
}

function displayNameFrom(email: string): string {
  const local = email.split("@")[0] ?? "";
  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join(" ") || "Partner user"
  );
}

export const authService = {
  async signIn({ email, password, remember }: SignInPayload): Promise<Session> {
    const trimmed = email.trim();

    if (!EMAIL_PATTERN.test(trimmed)) {
      throw new AuthError("Enter a valid email address.", "email");
    }
    if (password.length < 8) {
      throw new AuthError("Password must be at least 8 characters.", "password");
    }

    if (Config.features.mockData) {
      const user: AdminUser = {
        ...DEFAULT_ADMIN,
        email: trimmed,
        name:
          trimmed === DEFAULT_ADMIN.email
            ? DEFAULT_ADMIN.name
            : displayNameFrom(trimmed),
      };
      const session: Session = {
        user,
        token: mockToken(trimmed),
        expiresAt: expiryFor(remember),
        remember,
      };
      setToken(session.token);
      return session;
    }

    const { data } = await http.post<Session>("/auth/login", {
      email: trimmed,
      password,
    });
    setToken(data.token);
    return { ...data, remember };
  },

  async signUp({ fullName, email, password }: SignUpPayload): Promise<Session> {
    const name = fullName.trim();
    const trimmed = email.trim();

    if (name.length < 2) {
      throw new AuthError("Enter your full name.", "fullName");
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      throw new AuthError("Enter a valid email address.", "email");
    }
    const unmet = PASSWORD_RULES.filter((rule) => !rule.test(password));
    if (unmet.length) {
      throw new AuthError("Your password does not meet the requirements.", "password");
    }

    if (Config.features.mockData) {
      const session: Session = {
        user: { ...DEFAULT_ADMIN, name, email: trimmed },
        token: mockToken(trimmed),
        expiresAt: expiryFor(false),
        remember: false,
      };
      setToken(session.token);
      return session;
    }

    const { data } = await http.post<Session>("/auth/register", {
      fullName: name,
      email: trimmed,
      password,
    });
    setToken(data.token);
    return { ...data, remember: false };
  },

  /** Placeholder for the Google / Microsoft buttons. */
  async signInWithProvider(provider: "google" | "microsoft"): Promise<never> {
    throw new AuthError(
      `${provider === "google" ? "Google" : "Microsoft"} sign-in is not configured for this workspace yet.`
    );
  },

  async signOut(): Promise<void> {
    try {
      if (!Config.features.mockData) await http.post("/auth/logout");
    } finally {
      setToken(null);
    }
  },
};

export default authService;
