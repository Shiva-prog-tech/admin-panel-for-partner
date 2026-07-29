import type { Metadata } from "next";
import Cardholders from "@/modules/Cardholders/Cardholders";

export const metadata: Metadata = { title: "Cardholders" };

export default function CardholdersPage() {
  return <Cardholders />;
}
