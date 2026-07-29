"use client";

import { useMemo, useState } from "react";
import Icon from "@/Components/Icons/Icon";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/toastSlice";
import { CONVERT_ASSETS, CONVERT_CHAINS } from "@/types/constants";
import type { ConvertQuote } from "@/types/global";
import { poolBalances } from "@/utils/mockData/custody";
import { formatMoney } from "@/utils/helper";

/** Indicative USD rates used to price a settlement quote. */
const RATES: Record<string, number> = {
  BTC: 64213.5,
  ETH: 3184.2,
  USDT: 1,
  USDC: 1,
  TRX: 0.1324,
  MATIC: 0.5871,
};

const WITHDRAWAL_BPS = 25;

/**
 * "Convert custody → USD float" — settles from the pooled custody balance for
 * one asset/chain pair. Quote first, then settle.
 */
export default function ConvertCard() {
  const dispatch = useAppDispatch();

  const [asset, setAsset] = useState<string>("USDT");
  const [chain, setChain] = useState<string>("eth");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<ConvertQuote | null>(null);

  /** Custody holds exactly one balance per asset/chain pair. */
  const available = useMemo(() => {
    const match = poolBalances.find((p) => p.asset === asset && p.chain === chain);
    return match ? Number(match.balance) : 0;
  }, [asset, chain]);

  const parsed = Number(amount);
  const amountValid = amount !== "" && Number.isFinite(parsed) && parsed > 0;
  const overBalance = amountValid && parsed > available;
  const canQuote = amountValid && !overBalance;

  const reset = () => setQuote(null);

  const getQuote = () => {
    if (!canQuote) return;
    const rate = RATES[asset] ?? 1;
    const usd = Number((parsed * rate).toFixed(2));
    const feeUsd = Number(((usd * WITHDRAWAL_BPS) / 10_000).toFixed(2));

    setQuote({
      asset,
      chain,
      amount: parsed,
      rate,
      usd,
      feeUsd,
      netUsd: Number((usd - feeUsd).toFixed(2)),
    });
  };

  const settle = () => {
    if (!quote) return;
    dispatch(
      pushToast({
        tone: "success",
        title: "Settlement submitted",
        text: `${quote.amount} ${quote.asset} on ${quote.chain} → ${formatMoney(quote.netUsd)} float`,
      })
    );
    setAmount("");
    setQuote(null);
  };

  return (
    <section className="panel-card panel-card--divided u-mb-md convert-card">
      <div className="panel-card__head">
        <div>
          <h2 className="panel-card__title">Convert custody → USD float</h2>
          <p className="panel-card__sub">
            Settles from your pooled custody balance (one balance per asset/chain)
          </p>
        </div>
      </div>

      <div className="convert-card__grid">
        <label className="field">
          <span className="field__label">Asset</span>
          <span className="select select--tall" style={{ display: "block" }}>
            <select
              value={asset}
              style={{ width: "100%" }}
              onChange={(event) => {
                setAsset(event.target.value);
                reset();
              }}
            >
              {CONVERT_ASSETS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={15} className="select__caret" />
          </span>
        </label>

        <label className="field">
          <span className="field__label">Chain</span>
          <span className="select select--tall" style={{ display: "block" }}>
            <select
              value={chain}
              style={{ width: "100%" }}
              onChange={(event) => {
                setChain(event.target.value);
                reset();
              }}
            >
              {CONVERT_CHAINS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={15} className="select__caret" />
          </span>
        </label>

        <label className="field">
          <span className="field__label">Amount</span>
          <span className="field__control">
            <input
              inputMode="decimal"
              value={amount}
              placeholder="100.00"
              onChange={(event) => {
                setAmount(event.target.value);
                reset();
              }}
            />
          </span>
          <span
            className="field__hint"
            style={overBalance ? { color: "var(--red-text)" } : undefined}
          >
            {overBalance
              ? `Only ${available} ${asset} available on ${chain}`
              : `Available: ${available} ${asset}`}
          </span>
        </label>
      </div>

      <div className="convert-card__actions">
        <button
          type="button"
          className="btn btn--ghost"
          disabled={!canQuote}
          onClick={getQuote}
        >
          <Icon name="refresh" size={16} />
          Get quote
        </button>
        <button
          type="button"
          className="btn btn--brand"
          disabled={!quote}
          onClick={settle}
        >
          <Icon name="arrowRight" size={16} />
          Settle to float
        </button>
      </div>

      {quote && (
        <div className="convert-card__quote">
          <div className="kv-list">
            <div className="kv-list__row">
              <span className="kv-list__key">Rate</span>
              <span className="kv-list__val">
                1 {quote.asset} = {formatMoney(quote.rate)}
              </span>
            </div>
            <div className="kv-list__row">
              <span className="kv-list__key">Gross</span>
              <span className="kv-list__val">{formatMoney(quote.usd)}</span>
            </div>
            <div className="kv-list__row">
              <span className="kv-list__key">
                Withdrawal fee ({WITHDRAWAL_BPS} bps)
              </span>
              <span className="kv-list__val">−{formatMoney(quote.feeUsd)}</span>
            </div>
            <div className="kv-list__row">
              <span className="kv-list__key">Credited to float</span>
              <span className="kv-list__val" style={{ color: "var(--green-text)" }}>
                {formatMoney(quote.netUsd)}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
