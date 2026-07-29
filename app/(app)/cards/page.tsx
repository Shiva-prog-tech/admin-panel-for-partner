import type { Metadata } from "next";
import Cards from "@/modules/Cards/Cards";

export const metadata: Metadata = { title: "Cards" };

export default function CardsPage() {
  return <Cards />;
}
