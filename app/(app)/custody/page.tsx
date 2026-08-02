import type { Metadata } from "next";
import Custody from "@/modules/CustodyModule";

export const metadata: Metadata = { title: "Custody" };

export default function CustodyPage() {
  return <Custody />;
}
