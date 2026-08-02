import type { Metadata } from "next";
import Transactions from "@/modules/TransactionModule";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return <Transactions />;
}
