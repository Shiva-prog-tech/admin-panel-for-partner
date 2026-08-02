"use client";

import { useState } from "react";
import Modal from "@/Components/Popup/Popup";
import TextField from "@/Components/TextField";
import Select from "@/Components/Select";
import Icon from "@/Components/Icons";
import type { Cardholder } from "@/types/global";
import { COUNTRIES } from "@/utils/CountryData";
import { buttonStyles } from "@/Components/Button";
import { cx } from "@/utils/helper";

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
            className={cx(buttonStyles.btn, buttonStyles.ghost)}
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </button>
          <button type="button" className={cx(buttonStyles.btn, buttonStyles.brand)} onClick={submit}>
            <Icon name="shield" size={16} />
            Submit for review
          </button>
        </>
      }
    >
      <TextField
        compact
        id="ch-name"
        label="Full legal name"
        value={fullName}
        placeholder="As printed on the ID document"
        onChange={(value) => {
          setFullName(value);
          setError(null);
        }}
      />

      <TextField
        compact
        id="ch-enduser"
        label="End user ref ID"
        value={endUserRef}
        placeholder="6a690b01c39bc0d473e1e3"
        onChange={(value) => {
          setEndUserRef(value);
          setError(null);
        }}
      />

      <Select
        id="ch-product"
        label="Card product"
        value={product}
        onChange={setProduct}
        items={PRODUCTS}
        block
        tall
      />

      <Select
        id="ch-country"
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
