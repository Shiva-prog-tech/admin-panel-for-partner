import type { Metadata } from "next";
import ApiKeys from "@/modules/ApiKeysModule";

export const metadata: Metadata = { title: "API keys" };

export default function ApiKeysPage() {
  return <ApiKeys />;
}
