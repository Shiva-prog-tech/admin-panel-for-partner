"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `handler` when a pointer lands outside the returned ref, or when Esc
 * is pressed. Used by every popover, dropdown and modal in the panel.
 */
export default function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  enabled: boolean,
  handler: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) handler();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handler();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [enabled, handler]);

  return ref;
}
