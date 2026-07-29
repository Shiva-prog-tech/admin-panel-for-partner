import type { Metadata } from "next";
import Custody from "@/modules/Custody/Custody";

export const metadata: Metadata = { title: "Custody" };

export default function CustodyPage() {
  return <Custody />;
}
