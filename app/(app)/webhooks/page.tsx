import type { Metadata } from "next";
import Webhooks from "@/modules/WebhooksModule";

export const metadata: Metadata = { title: "Webhooks" };

export default function WebhooksPage() {
  return <Webhooks />;
}
