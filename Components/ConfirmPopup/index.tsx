"use client";

import Modal from "@/Components/Popup/Popup";
import { buttonStyles } from "@/Components/Button";
import { cx } from "@/utils/helper";

interface ConfirmPopupProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmPopup({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onClose,
}: ConfirmPopupProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button type="button" className={cx(buttonStyles.btn, buttonStyles.ghost)} onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={cx(buttonStyles.btn, danger ? buttonStyles.danger : buttonStyles.brand)}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55 }}>
        {message}
      </p>
    </Modal>
  );
}
