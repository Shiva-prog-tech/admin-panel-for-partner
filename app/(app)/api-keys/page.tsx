import type { Metadata } from "next";
import ApiKeys from "@/modules/ApiKeys/ApiKeys";

export const metadata: Metadata = { title: "API keys" };

export default function ApiKeysPage() {
  return <ApiKeys />;
}
