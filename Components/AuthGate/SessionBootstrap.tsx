"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { sessionRestored } from "@/redux/reducers/authSlice";
import { setToken } from "@/utils/axios";
import { readSession } from "@/utils/session";

/**
 * Reads the persisted session once per page load and marks the auth slice as
 * hydrated. Mounted at the root so both the app and the auth screens agree on
 * whether somebody is signed in.
 */
export default function SessionBootstrap() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  useEffect(() => {
    if (hydrated) return;

    const session = readSession();
    if (session) {
      setToken(session.token);
      dispatch(sessionRestored(session.user));
    } else {
      setToken(null);
      dispatch(sessionRestored(null));
    }
  }, [hydrated, dispatch]);

  return null;
}
