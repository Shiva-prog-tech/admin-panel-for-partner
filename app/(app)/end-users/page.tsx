import type { Metadata } from "next";
import EndUsers from "@/modules/EndUsersModule";

export const metadata: Metadata = { title: "End users" };

export default function EndUsersPage() {
  return <EndUsers />;
}
