"use client";

import { useState } from "react";
import Modal from "@/Components/Popup/Popup";
import TextField from "@/Components/TextField";
import Select from "@/Components/Select";
import Icon from "@/Components/Icons";
import type { EndUser } from "@/types/global";
import { COUNTRIES } from "@/utils/CountryData";
import { buttonStyles } from "@/Components/Button";
import { cx } from "@/utils/helper";

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
            className={cx(buttonStyles.btn, buttonStyles.ghost)}
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </button>
          <button type="button" className={cx(buttonStyles.btn, buttonStyles.brand)} onClick={submit}>
            <Icon name="send" size={16} />
            Send invitation
          </button>
        </>
      }
    >
      <TextField
        compact
        id="invite-email"
        label="Email address"
        type="email"
        value={email}
        placeholder="traveller@example.com"
        onChange={(value) => {
          setEmail(value);
          setError(null);
        }}
      />

      <TextField
        compact
        id="invite-reference"
        label="External reference (optional)"
        value={reference}
        placeholder="your-system-id"
        hint="Stored alongside the generated ref ID so you can reconcile records."
        onChange={setReference}
      />

      <Select
        id="invite-country"
        label="Country of residence"
        value={country}
        onChange={setCountry}
        items={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
        block
        tall
      />

      {error && (
        <p style={{ fontSize: 12.5, color: "var(--red-text)" }} role="alert">
          {error}
        </p>
      )}
    </Modal>
  );
}
