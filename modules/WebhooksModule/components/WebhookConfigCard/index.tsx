"use client";

import { useState } from "react";
import Icon from "@/Components/Icons";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/ToastReducer";
import { webhookConfig } from "@/mockData/webhookDeliveries";
import { cx, formatDateLong } from "@/utils/helper";
import { buttonStyles } from "@/Components/Button";
import { panelStyles } from "@/Components/PanelCard";
import styles from "./WebhookConfigCard.module.scss";

/** Endpoint URL + signing secret for this tenant. */
export default function WebhookConfigCard() {
  const dispatch = useAppDispatch();

  const [url, setUrl] = useState(webhookConfig.url);
  const [saved, setSaved] = useState(webhookConfig.url);
  const [error, setError] = useState<string | null>(null);

  const dirty = url.trim() !== saved;

  const save = () => {
    const value = url.trim();
    if (!/^https:\/\/[^\s]+\.[^\s]{2,}/.test(value)) {
      setError("The endpoint must be a reachable HTTPS URL.");
      return;
    }
    setError(null);
    setSaved(value);
    dispatch(
      pushToast({
        tone: "success",
        title: "Webhook URL saved",
        text: value,
      })
    );
  };

  return (
    <section className={cx(panelStyles.card, panelStyles.divided, "u-mb-md")}>
      <div className={panelStyles.head}>
        <div>
          <h2 className={panelStyles.title}>Configuration</h2>
          <p className={panelStyles.sub}>
            Signing secret {webhookConfig.secretHint} · rotated{" "}
            {formatDateLong(webhookConfig.rotatedAt)}
          </p>
        </div>
      </div>

      <div className={styles.config}>
        <label className={styles.field}>
          <span className="u-sr-only">Webhook endpoint URL</span>
          <span className={styles.control}>
            <input
              value={url}
              placeholder="https://example.com/hooks/swipeo"
              onChange={(event) => {
                setUrl(event.target.value);
                setError(null);
              }}
            />
          </span>
          {error && (
            <span className={cx(styles.hint, styles.error)} role="alert">
              {error}
            </span>
          )}
        </label>

        <div className={styles.actions}>
          <button
            type="button"
            className={cx(buttonStyles.btn, buttonStyles.brand)}
            disabled={!dirty}
            onClick={save}
          >
            <Icon name="check" size={16} />
            Save URL
          </button>
          <button
            type="button"
            className={cx(buttonStyles.btn, buttonStyles.ghost)}
            onClick={() =>
              dispatch(
                pushToast({
                  tone: "success",
                  title: "Signing secret rotated",
                  text: "The previous secret stays valid for 24 hours.",
                })
              )
            }
          >
            <Icon name="refresh" size={16} />
            Rotate secret
          </button>
        </div>
      </div>
    </section>
  );
}
