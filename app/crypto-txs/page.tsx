import type { Metadata } from "next";
import CryptoTxs from "@/modules/CryptoTxs/CryptoTxs";

export const metadata: Metadata = { title: "Crypto txs" };

export default function CryptoTxsPage() {
  return <CryptoTxs />;
}
