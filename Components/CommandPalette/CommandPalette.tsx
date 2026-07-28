"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Icon, { type IconName } from "@/Components/Icons/Icon";
import useClickOutside from "@/customHooks/useClickOutside";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPaletteOpen } from "@/redux/reducers/configSlice";
import { NAV_ITEMS } from "@/types/constants";
import { cx } from "@/utils/helper";

const ACTIONS = [
  { label: "Invite an end user", href: "/end-users", icon: "plus" as IconName },
  { label: "Review the KYC queue", href: "/cardholders", icon: "shield" as IconName },
  { label: "Create an API key", href: "/api-keys", icon: "key" as IconName },
  { label: "Inspect webhook deliveries", href: "/webhooks", icon: "webhook" as IconName },
  { label: "Open the float ledger", href: "/float", icon: "wallet" as IconName },
];

/** ⌘K launcher — jump to any page or common task. */
export default function CommandPalette() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.config.paletteOpen);
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const close = () => dispatch(setPaletteOpen(false));
  const ref = useClickOutside<HTMLDivElement>(open, close);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
    }
  }, [open]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pages = NAV_ITEMS.filter((item) =>
      item.label.toLowerCase().includes(needle)
    ).map((item) => ({ ...item, group: "Pages" as const }));
    const actions = ACTIONS.filter((item) =>
      item.label.toLowerCase().includes(needle)
    ).map((item) => ({ ...item, group: "Actions" as const }));
    return [...pages, ...actions];
  }, [query]);

  if (!open) return null;

  const go = (href: string) => {
    close();
    router.push(href);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => (c + 1) % Math.max(1, results.length));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) => (c - 1 + results.length) % Math.max(1, results.length));
    }
    if (event.key === "Enter" && results[cursor]) {
      event.preventDefault();
      go(results[cursor].href);
    }
  };

  let lastGroup = "";

  return (
    <div className="palette-overlay" role="dialog" aria-modal="true" aria-label="Search">
      <div className="palette" ref={ref} onKeyDown={onKeyDown}>
        <div className="palette__input-row">
          <Icon name="search" size={18} />
          <input
            autoFocus
            value={query}
            placeholder="Search pages, records and actions..."
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
          />
          <span className="omnisearch__kbd">esc</span>
        </div>

        <div className="palette__list">
          {results.length === 0 && (
            <div className="palette__empty">No matches for “{query}”</div>
          )}

          {results.map((item, index) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;

            return (
              <div key={`${item.group}-${item.href}-${item.label}`}>
                {header && <div className="palette__group">{header}</div>}
                <button
                  type="button"
                  className={cx("palette__item", index === cursor && "palette__item--active")}
                  onMouseEnter={() => setCursor(index)}
                  onClick={() => go(item.href)}
                >
                  <Icon name={item.icon as IconName} size={17} />
                  <span>{item.label}</span>
                  <span className="palette__hint">↵</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
