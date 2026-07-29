"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { signOut } from "@/redux/reducers/authSlice";
import authService from "@/services/auth.service";
import { AUTH_ROUTES } from "@/types/constants";
import { clearSession } from "@/utils/session";

/**
 * Ends the session everywhere: server (when wired), stored token, redux, then
 * routes back to the sign-in screen.
 */
export default function useSignOut() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useCallback(async () => {
    try {
      await authService.signOut();
    } finally {
      clearSession();
      dispatch(signOut());
      router.replace(AUTH_ROUTES.signIn);
    }
  }, [dispatch, router]);
}
