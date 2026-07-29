"use client";

import { useState } from "react";
import Icon from "@/Components/Icons/Icon";
import useClickOutside from "@/customHooks/useClickOutside";
import { LANGUAGES } from "@/types/constants";

/**
 * Locale picker on the auth screens. It records the choice locally; wiring it
 * to a translation catalogue is a separate piece of work.
 */
export default function LanguageSelect() {
  const [code, setCode] = useState("en");
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(open, () => setOpen(false));

  const active = LANGUAGES.find((l) => l.value === code) ?? LANGUAGES[0];

  return (
    <div className="popover lang" ref={ref}>
      <button
        type="button"
        className="lang__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Icon name="globe" size={16} />
        <span>{active.label}</span>
        <Icon name="chevronDown" size={15} className="lang__caret" />
      </button>

      {open && (
        <div className="popover__panel" role="listbox">
          {LANGUAGES.map((language) => (
            <button
              key={language.value}
              type="button"
              role="option"
              aria-selected={language.value === code}
              className="menu-item"
              onClick={() => {
                setCode(language.value);
                setOpen(false);
              }}
            >
              <span>{language.label}</span>
              {language.value === code && (
                <Icon name="check" size={15} className="menu-item__check" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
