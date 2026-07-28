"use client";

import { useCallback, useEffect, useState } from "react";
import type { Theme } from "@/types/global";
import { Config } from "@/utils/Config";

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(Config.storageKeys.theme);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Reads the theme that the boot script already stamped onto <html> and keeps
 * it in sync with localStorage. Starts as "light" on the server so the first
 * client render matches the markup.
 */
export default function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    setTheme(attr === "dark" ? "dark" : readStoredTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(Config.storageKeys.theme, theme);
    } catch {
      /* ignore */
    }
  }, [theme, mounted]);

  const toggle = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, setTheme, toggle, mounted };
}
