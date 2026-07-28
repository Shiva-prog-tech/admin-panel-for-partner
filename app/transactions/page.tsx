import type { Metadata } from "next";
import Transactions from "@/modules/Transactions/Transactions";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return <Transactions />;
}
