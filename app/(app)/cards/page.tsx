import type { Metadata } from "next";
import Cards from "@/modules/CardsModule";

export const metadata: Metadata = { title: "Cards" };

export default function CardsPage() {
  return <Cards />;
}
