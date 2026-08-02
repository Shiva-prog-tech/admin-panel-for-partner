"use client";

import { useEffect } from "react";
import Icon, { type IconName } from "@/Components/Icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dismissToast } from "@/redux/reducers/ToastReducer";
import { cx } from "@/utils/helper";
import styles from "./Toast.module.scss";

const ICONS: Record<string, IconName> = {
  success: "checkCircle",
  error: "alert",
  info: "info",
  brand: "sparkles",
};

const TONE: Record<string, string> = {
  success: styles.success,
  error: styles.error,
  info: styles.info,
  brand: styles.brand,
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
    <div className={styles.host} role="status" aria-live="polite">
      {items.map((item) => (
        <div key={item.id} className={cx(styles.toast, TONE[item.tone])}>
          <span className={styles.icon}>
            <Icon name={ICONS[item.tone] ?? "info"} size={18} />
          </span>
          <div className={styles.body}>
            <div className={styles.title}>{item.title}</div>
            {item.text && <div className={styles.text}>{item.text}</div>}
          </div>
          <button
            type="button"
            className={styles.close}
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
