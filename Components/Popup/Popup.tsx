"use client";

import { useEffect, type ReactNode } from "react";
import Icon from "@/Components/Icons";
import useClickOutside from "@/customHooks/useClickOutside";
import { cx } from "@/utils/helper";
import styles from "./popup.module.scss";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const ref = useClickOutside<HTMLDivElement>(open, onClose);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={cx(styles.modal, size === "lg" && styles.lg)}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className={styles.head}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.sub}>{subtitle}</p>}
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="close" size={17} />
          </button>
        </header>

        <div className={styles.body}>{children}</div>

        {footer && <footer className={styles.foot}>{footer}</footer>}
      </div>
    </div>
  );
}
