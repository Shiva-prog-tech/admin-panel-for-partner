"use client";

import { useState } from "react";
import Icon from "@/Components/Icons/Icon";
import { cx } from "@/utils/helper";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string | null;
  onEnter?: () => void;
}

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter your password",
  autoComplete = "current-password",
  error,
  onEnter,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cx("field", error && "field--error")}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>

      <div className="field__control">
        <Icon name="lock" size={16} className="field__icon" />
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && onEnter) onEnter();
          }}
        />
        <button
          type="button"
          className="field__reveal"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          tabIndex={-1}
        >
          <Icon name={visible ? "eyeOff" : "eye"} size={17} />
        </button>
      </div>

      {error && (
        <p className="field__hint field__hint--error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
