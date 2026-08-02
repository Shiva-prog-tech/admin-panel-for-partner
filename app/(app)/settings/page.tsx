import type { Metadata } from "next";
import Settings from "@/modules/SettingsModule";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <Settings />;
}
