"use client";

import { useState } from "react";
import Modal from "@/Components/PopUps/Modal";
import Icon from "@/Components/Icons/Icon";
import type { EndUser } from "@/types/global";
import { COUNTRIES } from "@/utils/CountryData";

interface AddEndUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (user: EndUser) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function AddEndUserModal({
  open,
  onClose,
  onCreate,
}: AddEndUserModalProps) {
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [country, setCountry] = useState("AE");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setEmail("");
    setReference("");
    setCountry("AE");
    setError(null);
  };

  const submit = () => {
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address for the invitation.");
      return;
    }

    const stamp = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const createdAt =
      `${stamp.getFullYear()}-${pad(stamp.getMonth() + 1)}-${pad(stamp.getDate())}` +
      `T${pad(stamp.getHours())}:${pad(stamp.getMinutes())}:${pad(stamp.getSeconds())}`;

    onCreate({
      id: `eu-new-${stamp.getTime()}`,
      refId:
        reference.trim() ||
        `${stamp.getTime().toString(16)}${country.toLowerCase()}`,
      cards: 0,
      cardholders: 0,
      cardTxs: 0,
      walletTxs: 0,
      deposited: null,
      createdAt,
      status: "Invited",
    });

    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Invite an end user"
      subtitle="They receive a signup link and appear here as “Invited” until onboarding completes."
      footer={
        <>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </button>
          <button type="button" className="btn btn--brand" onClick={submit}>
            <Icon name="send" size={16} />
            Send invitation
          </button>
        </>
      }
    >
      <label className="field">
        <span className="field__label">Email address</span>
        <span className="field__control">
          <input
            type="email"
            value={email}
            placeholder="traveller@example.com"
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
            }}
          />
        </span>
      </label>

      <label className="field">
        <span className="field__label">External reference (optional)</span>
        <span className="field__control">
          <input
            value={reference}
            placeholder="your-system-id"
            onChange={(event) => setReference(event.target.value)}
          />
        </span>
        <span className="field__hint">
          Stored alongside the generated ref ID so you can reconcile records.
        </span>
      </label>

      <label className="field">
        <span className="field__label">Country of residence</span>
        <span className="select select--tall" style={{ display: "block" }}>
          <select
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            style={{ width: "100%" }}
          >
            {COUNTRIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" size={15} className="select__caret" />
        </span>
      </label>

      {error && (
        <p style={{ fontSize: 12.5, color: "var(--red-text)" }} role="alert">
          {error}
        </p>
      )}
    </Modal>
  );
}
