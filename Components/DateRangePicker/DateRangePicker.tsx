"use client";

import { useState } from "react";
import Icon from "@/Components/Icons/Icon";
import useClickOutside from "@/customHooks/useClickOutside";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRange } from "@/redux/reducers/configSlice";
import { DATE_RANGES } from "@/types/constants";
import { cx } from "@/utils/helper";

/** Header date-range control with preset menu. */
export default function DateRangePicker() {
  const dispatch = useAppDispatch();
  const rangeId = useAppSelector((state) => state.config.rangeId);
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(open, () => setOpen(false));

  const active = DATE_RANGES.find((r) => r.id === rangeId) ?? DATE_RANGES[0];

  return (
    <div className="range-picker" ref={ref}>
      <button
        type="button"
        className="range-picker__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Icon name="calendar" size={17} className="range-picker__icon" />
        <span>{active.label}</span>
        <Icon name="chevronDown" size={16} className="range-picker__caret" />
      </button>

      {open && (
        <div className="range-picker__pop" role="listbox">
          {DATE_RANGES.map((range) => (
            <button
              key={range.id}
              type="button"
              role="option"
              aria-selected={range.id === rangeId}
              className={cx(
                "range-picker__opt",
                range.id === rangeId && "range-picker__opt--active"
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
