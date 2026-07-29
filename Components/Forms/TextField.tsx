"use client";

import Icon, { type IconName } from "@/Components/Icons/Icon";
import { cx } from "@/utils/helper";

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
  autoFocus,
  onEnter,
}: TextFieldProps) {
  return (
    <div className={cx("field", error && "field--error")}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>

      <div className="field__control">
        {icon && <Icon name={icon} size={16} className="field__icon" />}
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
        <p className="field__hint field__hint--error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
