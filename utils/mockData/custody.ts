// ===========================================================================
// Custody wallets dataset
// ===========================================================================
import { custodyBalances } from "./dashboard";

export interface CustodyWallet {
  id: string;
  label: string;
  symbol: string;
  network: string;
  address: string;
  balance: string;
  usdValue: number;
  state: "Active" | "Frozen";
  createdAt: string;
}

export const custodyWallets: CustodyWallet[] = [
  {
    id: "cw-1",
    label: "Settlement — TRON",
    symbol: "USDT",
    network: "TRON",
    address: "TQmVc4bK9uWZ6nS3xJ8pR1dLhYf7GaN2Vt",
    balance: "35.8172204",
    usdValue: 35.82,
    state: "Active",
    createdAt: "2025-09-11T10:22:14",
  },
  {
    id: "cw-2",
    label: "Gas — TRON",
    symbol: "TRX",
    network: "TRON",
    address: "TQmVc4bK9uWZ6nS3xJ8pR1dLhYf7GaN2Vt",
    balance: "2.58785823",
    usdValue: 0.34,
    state: "Active",
    createdAt: "2025-09-11T10:22:14",
  },
  {
    id: "cw-3",
    label: "Settlement — Ethereum",
    symbol: "USDT",
    network: "Ethereum",
    address: "0x7Ae4f1C93b60D2aE58c0139dB4c7fE2a01B9d3Cf",
    balance: "1.549209",
    usdValue: 1.55,
    state: "Active",
    createdAt: "2025-10-02T14:41:09",
  },
  {
    id: "cw-4",
    label: "Treasury — BSC",
    symbol: "USDT",
    network: "BSC",
    address: "0x2Fb81aC7e50D93fA4c19b6D208eE7c31Aa54B9e0",
    balance: "476.2700019",
    usdValue: 476.27,
    state: "Active",
    createdAt: "2025-10-19T08:15:53",
  },
  {
    id: "cw-5",
    label: "Reserve — Ethereum",
    symbol: "USDC",
    network: "Ethereum",
    address: "0x9C3a72E5d81B40fAe6D7c8b19aF25e0331D4a7B8",
    balance: "15",
    usdValue: 15,
    state: "Active",
    createdAt: "2026-01-07T19:38:26",
  },
];

export const custodyStats = {
  wallets: custodyWallets.length,
  totalUsd: Number(
    custodyWallets.reduce((acc, w) => acc + w.usdValue, 0).toFixed(2)
  ),
  networks: new Set(custodyWallets.map((w) => w.network)).size,
  assets: new Set(custodyWallets.map((w) => w.symbol)).size,
};

export { custodyBalances };

export default custodyWallets;
