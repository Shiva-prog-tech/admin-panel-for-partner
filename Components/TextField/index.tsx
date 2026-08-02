"use client";

import Icon, { type IconName } from "@/Components/Icons";
import { cx } from "@/utils/helper";
import styles from "./TextField.module.scss";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** leading glyph inside the control */
  icon?: IconName;
  type?: "text" | "email";
  autoComplete?: string;
  error?: string | null;
  hint?: string;
  /** 42px control used inside modals and toolbars (auth screens use 48px) */
  compact?: boolean;
  autoFocus?: boolean;
  onEnter?: () => void;
}

export default function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  autoComplete,
  error,
  hint,
  compact = false,
  autoFocus,
  onEnter,
}: TextFieldProps) {
  return (
    <div className={cx(styles.field, error && styles.error)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <div className={cx(styles.control, compact && styles.controlCompact)}>
        {icon && <Icon name={icon} size={16} className={styles.icon} />}
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && onEnter) onEnter();
          }}
        />
      </div>

      {error ? (
        <p className={cx(styles.hint, styles.hintError)} id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className={styles.hint} id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
