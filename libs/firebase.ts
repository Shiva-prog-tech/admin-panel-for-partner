// ===========================================================================
// Firebase wiring.
//
// The panel only needs Firebase for optional web-push notifications, so the
// SDK is *not* a hard dependency: this module exposes the config plus a lazy
// initialiser that no-ops when the package is absent. Install `firebase` and
// fill in the env vars to switch it on.
// ===========================================================================

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

let initialised = false;

/**
 * Initialises the Firebase app once, if (and only if) the SDK is installed and
 * the environment is configured. Returns the app instance or null.
 */
export async function initFirebase(): Promise<unknown | null> {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured()) return null;
  if (initialised) return null;

  try {
    // Resolved at runtime so a missing package never breaks the build.
    const mod = (await import(
      /* webpackIgnore: true */ "firebase/app" as string
    )) as {
      initializeApp: (config: FirebaseConfig) => unknown;
      getApps: () => unknown[];
    };
    initialised = true;
    return mod.getApps().length ? mod.getApps()[0] : mod.initializeApp(firebaseConfig);
  } catch {
    // SDK not installed — push notifications stay disabled.
    return null;
  }
}
