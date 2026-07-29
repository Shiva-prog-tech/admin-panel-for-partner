"use client";

import type { ReactNode } from "react";
import Icon from "@/Components/Icons/Icon";
import { cx } from "@/utils/helper";

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  error?: boolean;
}

/**
 * Native checkbox kept in the accessibility tree and visually replaced, so
 * label clicks, keyboard focus and form semantics all still work.
 */
export default function Checkbox({
  id,
  checked,
  onChange,
  children,
  error,
}: CheckboxProps) {
  return (
    <div className={cx("cbx", error && "cbx--error")}>
      <input
        id={id}
        type="checkbox"
        className="cbx__input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label className="cbx__label" htmlFor={id}>
        <span className="cbx__box" aria-hidden="true">
          {checked && <Icon name="check" size={12} strokeWidth={3} />}
        </span>
        <span className="cbx__text">{children}</span>
      </label>
    </div>
  );
}
