"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/Components/Loader/Loader";
import { useAppSelector } from "@/redux/hooks";
import { AUTH_ROUTES } from "@/types/constants";

/**
 * Blocks the backoffice until a session exists. `SessionBootstrap` resolves the
 * stored session first, so this only renders the spinner for one tick.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, hydrated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (hydrated && !user) router.replace(AUTH_ROUTES.signIn);
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="auth-loading">
        <Loader
          block
          size="lg"
          label={hydrated ? "Redirecting to sign in…" : "Checking your session…"}
        />
      </div>
    );
  }

  return <>{children}</>;
}
