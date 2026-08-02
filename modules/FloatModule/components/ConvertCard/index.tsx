"use client";

import { useMemo, useState } from "react";
import Icon from "@/Components/Icons";
import TextField from "@/Components/TextField";
import Select from "@/Components/Select";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/ToastReducer";
import { CONVERT_ASSETS, CONVERT_CHAINS } from "@/types/constants";
import type { ConvertQuote } from "../../types";
import { poolBalances } from "@/mockData/custody";
import { cx, formatMoney } from "@/utils/helper";
import { buttonStyles } from "@/Components/Button";
import { panelStyles } from "@/Components/PanelCard";
import styles from "./ConvertCard.module.scss";

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
    <section className={cx(panelStyles.card, panelStyles.divided, "u-mb-md")}>
      <div className={panelStyles.head}>
        <div>
          <h2 className={panelStyles.title}>Convert custody → USD float</h2>
          <p className={panelStyles.sub}>
            Settles from your pooled custody balance (one balance per asset/chain)
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        <Select
          id="convert-asset"
          label="Asset"
          value={asset}
          onChange={(value) => {
            setAsset(value);
            reset();
          }}
          items={CONVERT_ASSETS}
          block
          tall
        />

        <Select
          id="convert-chain"
          label="Chain"
          value={chain}
          onChange={(value) => {
            setChain(value);
            reset();
          }}
          items={CONVERT_CHAINS}
          block
          tall
        />

        <TextField
        compact
          id="convert-amount"
          label="Amount"
          value={amount}
          placeholder="100.00"
          hint={`Available: ${available} ${asset}`}
          error={overBalance ? `Only ${available} ${asset} available on ${chain}` : null}
          onChange={(value) => {
            setAmount(value);
            reset();
          }}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={cx(buttonStyles.btn, buttonStyles.ghost)}
          disabled={!canQuote}
          onClick={getQuote}
        >
          <Icon name="refresh" size={16} />
          Get quote
        </button>
        <button
          type="button"
          className={cx(buttonStyles.btn, buttonStyles.brand)}
          disabled={!quote}
          onClick={settle}
        >
          <Icon name="arrowRight" size={16} />
          Settle to float
        </button>
      </div>

      {quote && (
        <div className={styles.quote}>
          <div>
            <div className={styles.kvRow}>
              <span className={styles.kvKey}>Rate</span>
              <span className={styles.kvVal}>
                1 {quote.asset} = {formatMoney(quote.rate)}
              </span>
            </div>
            <div className={styles.kvRow}>
              <span className={styles.kvKey}>Gross</span>
              <span className={styles.kvVal}>{formatMoney(quote.usd)}</span>
            </div>
            <div className={styles.kvRow}>
              <span className={styles.kvKey}>
                Withdrawal fee ({WITHDRAWAL_BPS} bps)
              </span>
              <span className={styles.kvVal}>−{formatMoney(quote.feeUsd)}</span>
            </div>
            <div className={styles.kvRow}>
              <span className={styles.kvKey}>Credited to float</span>
              <span className={cx(styles.kvVal, styles.credited)}>
                {formatMoney(quote.netUsd)}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
