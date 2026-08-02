"use client";

import { useState } from "react";
import Icon from "@/Components/Icons";
import Dropdown, { dropdownStyles } from "@/Components/Dropdown";
import { LANGUAGES } from "@/types/constants";
import styles from "./LanguageSelect.module.scss";

/**
 * Locale picker on the auth screens. It records the choice locally; wiring it
 * to a translation catalogue is a separate piece of work.
 */
export default function LanguageSelect() {
  const [code, setCode] = useState("en");
  const [open, setOpen] = useState(false);

  const active = LANGUAGES.find((l) => l.value === code) ?? LANGUAGES[0];

  return (
    <Dropdown
      open={open}
      onClose={() => setOpen(false)}
      role="listbox"
      trigger={
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <Icon name="globe" size={16} />
          <span>{active.label}</span>
          <Icon name="chevronDown" size={15} className={styles.caret} />
        </button>
      }
    >
      {LANGUAGES.map((language) => (
        <button
          key={language.value}
          type="button"
          role="option"
          aria-selected={language.value === code}
          className={dropdownStyles.item}
          onClick={() => {
            setCode(language.value);
            setOpen(false);
          }}
        >
          <span>{language.label}</span>
          {language.value === code && (
            <Icon name="check" size={15} className={dropdownStyles.itemCheck} />
          )}
        </button>
      ))}
    </Dropdown>
  );
}
