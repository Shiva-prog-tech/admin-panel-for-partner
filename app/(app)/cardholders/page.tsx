import type { Metadata } from "next";
import Cardholders from "@/modules/CardholdersModule";

export const metadata: Metadata = { title: "Cardholders" };

export default function CardholdersPage() {
  return <Cardholders />;
}
