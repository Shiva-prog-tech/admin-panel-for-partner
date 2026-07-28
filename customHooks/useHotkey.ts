"use client";

import { useEffect } from "react";

interface Options {
  /** requires ⌘ on macOS / Ctrl elsewhere */
  meta?: boolean;
  enabled?: boolean;
}

/** Binds a single-character hotkey to a handler. */
export default function useHotkey(
  key: string,
  handler: () => void,
  { meta = false, enabled = true }: Options = {}
) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (meta && !(event.metaKey || event.ctrlKey)) return;
      if (!meta && (event.metaKey || event.ctrlKey)) return;

      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing && !meta) return;

      event.preventDefault();
      handler();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, handler, meta, enabled]);
}
