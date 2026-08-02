import type { Metadata } from "next";
import AuditLog from "@/modules/AuditLogModule";

export const metadata: Metadata = { title: "Audit log" };

export default function AuditLogPage() {
  return <AuditLog />;
}
