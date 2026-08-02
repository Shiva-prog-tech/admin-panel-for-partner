import type { Metadata } from "next";
import Float from "@/modules/FloatModule";

export const metadata: Metadata = { title: "Float" };

export default function FloatPage() {
  return <Float />;
}
