import type { Metadata } from "next";
import Dashboard from "@/modules/DashboardModule";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <Dashboard />;
}
