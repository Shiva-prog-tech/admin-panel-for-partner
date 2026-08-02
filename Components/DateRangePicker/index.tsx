"use client";

import { useState } from "react";
import Icon from "@/Components/Icons";
import useClickOutside from "@/customHooks/useClickOutside";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRange } from "@/redux/reducers/ConfigReducer";
import { DATE_RANGES } from "@/types/constants";
import { cx } from "@/utils/helper";
import styles from "./DateRangePicker.module.scss";

/** Header date-range control with preset menu. */
export default function DateRangePicker() {
  const dispatch = useAppDispatch();
  const rangeId = useAppSelector((state) => state.config.rangeId);
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(open, () => setOpen(false));

  const active = DATE_RANGES.find((r) => r.id === rangeId) ?? DATE_RANGES[0];

  return (
    <div className={styles.picker} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Icon name="calendar" size={17} className={styles.icon} />
        <span>{active.label}</span>
        <Icon name="chevronDown" size={16} className={styles.caret} />
      </button>

      {open && (
        <div className={styles.pop} role="listbox">
          {DATE_RANGES.map((range) => (
            <button
              key={range.id}
              type="button"
              role="option"
              aria-selected={range.id === rangeId}
              className={cx(
                styles.opt,
                range.id === rangeId && styles.optActive
              )}
              onClick={() => {
                dispatch(setRange(range.id));
                setOpen(false);
              }}
            >
              <span>{range.label}</span>
              {range.id === rangeId && <Icon name="check" size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
