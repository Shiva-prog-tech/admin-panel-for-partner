"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Copies text and reports a short-lived "copied" flag for UI feedback. */
export default function useCopyToClipboard(resetAfter = 1400) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const copy = useCallback(
    async (value: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          // Fallback for non-secure contexts.
          const area = document.createElement("textarea");
          area.value = value;
          area.style.position = "fixed";
          area.style.opacity = "0";
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          document.body.removeChild(area);
        }
        setCopied(value);
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(null), resetAfter);
        return true;
      } catch {
        return false;
      }
    },
    [resetAfter]
  );

  return { copy, copied };
}
