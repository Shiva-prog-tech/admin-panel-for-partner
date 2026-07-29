import type { Metadata } from "next";
import CardOrders from "@/modules/CardOrders/CardOrders";

export const metadata: Metadata = { title: "Card orders" };

export default function CardOrdersPage() {
  return <CardOrders />;
}
