"use client";

import { useState } from "react";
import Modal from "@/Components/PopUps/Modal";
import Icon from "@/Components/Icons/Icon";
import type { Cardholder } from "@/types/global";
import { COUNTRIES } from "@/utils/CountryData";

interface AddCardholderModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (cardholder: Cardholder) => void;
}

const PRODUCTS = [
  "prod_TM1031",
  "prod_TM1042",
  "prod_TM1049",
  "prod_TM1050",
  "prod_TM1059",
  "prod_TM1060",
  "prod_TM102B",
  "prod_TM110A",
];

export default function AddCardholderModal({
  open,
  onClose,
  onCreate,
}: AddCardholderModalProps) {
  const [fullName, setFullName] = useState("");
  const [endUserRef, setEndUserRef] = useState("");
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [country, setCountry] = useState("AE");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFullName("");
    setEndUserRef("");
    setProduct(PRODUCTS[0]);
    setCountry("AE");
    setError(null);
  };

  const submit = () => {
    if (fullName.trim().length < 3) {
      setError("Enter the cardholder's full legal name.");
      return;
    }
    if (!endUserRef.trim()) {
      setError("Link the application to an existing end user ref ID.");
      return;
    }

    const stamp = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const createdAt =
      `${stamp.getFullYear()}-${pad(stamp.getMonth() + 1)}-${pad(stamp.getDate())}` +
      `T${pad(stamp.getHours())}:${pad(stamp.getMinutes())}:${pad(stamp.getSeconds())}`;

    onCreate({
      id: `ch-new-${stamp.getTime()}`,
      refId: `${stamp.getTime().toString(16)}${country.toLowerCase()}`,
      product,
      status: "Pending",
      reason: null,
      cards: 0,
      wallets: 0,
      deposited: null,
      createdAt,
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
      title="Add a cardholder"
      subtitle="The application enters the KYC queue as “Pending” until the issuer responds."
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
            <Icon name="shield" size={16} />
            Submit for review
          </button>
        </>
      }
    >
      <label className="field">
        <span className="field__label">Full legal name</span>
        <span className="field__control">
          <input
            value={fullName}
            placeholder="As printed on the ID document"
            onChange={(event) => {
              setFullName(event.target.value);
              setError(null);
            }}
          />
        </span>
      </label>

      <label className="field">
        <span className="field__label">End user ref ID</span>
        <span className="field__control">
          <input
            value={endUserRef}
            placeholder="6a690b01c39bc0d473e1e3"
            onChange={(event) => {
              setEndUserRef(event.target.value);
              setError(null);
            }}
          />
        </span>
      </label>

      <label className="field">
        <span className="field__label">Card product</span>
        <span className="select select--tall" style={{ display: "block" }}>
          <select
            value={product}
            onChange={(event) => setProduct(event.target.value)}
            style={{ width: "100%" }}
          >
            {PRODUCTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" size={15} className="select__caret" />
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
