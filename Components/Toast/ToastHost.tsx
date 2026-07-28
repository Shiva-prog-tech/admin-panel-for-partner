"use client";

import { useEffect } from "react";
import Icon, { type IconName } from "@/Components/Icons/Icon";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dismissToast } from "@/redux/reducers/toastSlice";
import { cx } from "@/utils/helper";

const ICONS: Record<string, IconName> = {
  success: "checkCircle",
  error: "alert",
  info: "info",
  brand: "sparkles",
};

const LIFETIME = 4200;

export default function ToastHost() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.toast.items);

  useEffect(() => {
    if (!items.length) return;
    const timers = items.map((item) =>
      window.setTimeout(() => dispatch(dismissToast(item.id)), LIFETIME)
    );
    return () => timers.forEach(window.clearTimeout);
  }, [items, dispatch]);

  if (!items.length) return null;

  return (
    <div className="toast-host" role="status" aria-live="polite">
      {items.map((item) => (
        <div key={item.id} className={cx("toast", `toast--${item.tone}`)}>
          <span className="toast__icon">
            <Icon name={ICONS[item.tone] ?? "info"} size={18} />
          </span>
          <div className="toast__body">
            <div className="toast__title">{item.title}</div>
            {item.text && <div className="toast__text">{item.text}</div>}
          </div>
          <button
            type="button"
            className="toast__close"
            onClick={() => dispatch(dismissToast(item.id))}
            aria-label="Dismiss"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
