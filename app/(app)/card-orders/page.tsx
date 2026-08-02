import type { Metadata } from "next";
import CardOrders from "@/modules/CardOrdersModule";

export const metadata: Metadata = { title: "Card orders" };

export default function CardOrdersPage() {
  return <CardOrders />;
}
