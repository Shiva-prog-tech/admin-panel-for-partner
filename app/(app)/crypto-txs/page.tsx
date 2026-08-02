import type { Metadata } from "next";
import CryptoTxs from "@/modules/CryptoTxsModule";

export const metadata: Metadata = { title: "Crypto txs" };

export default function CryptoTxsPage() {
  return <CryptoTxs />;
}
