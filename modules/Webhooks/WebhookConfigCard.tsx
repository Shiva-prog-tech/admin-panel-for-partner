"use client";

import { useState } from "react";
import Icon from "@/Components/Icons/Icon";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/toastSlice";
import { webhookConfig } from "@/utils/mockData/webhookDeliveries";
import { formatDateLong } from "@/utils/helper";

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
    <section className="panel-card panel-card--divided u-mb-md">
      <div className="panel-card__head">
        <div>
          <h2 className="panel-card__title">Configuration</h2>
          <p className="panel-card__sub">
            Signing secret {webhookConfig.secretHint} · rotated{" "}
            {formatDateLong(webhookConfig.rotatedAt)}
          </p>
        </div>
      </div>

      <div className="webhook-config">
        <label className="field webhook-config__field">
          <span className="u-sr-only">Webhook endpoint URL</span>
          <span className="field__control">
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
            <span className="field__hint" style={{ color: "var(--red-text)" }} role="alert">
              {error}
            </span>
          )}
        </label>

        <div className="webhook-config__actions">
          <button
            type="button"
            className="btn btn--brand"
            disabled={!dirty}
            onClick={save}
          >
            <Icon name="check" size={16} />
            Save URL
          </button>
          <button
            type="button"
            className="btn btn--ghost"
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
