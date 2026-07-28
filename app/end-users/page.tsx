import type { Metadata } from "next";
import EndUsers from "@/modules/EndUsers/EndUsers";

export const metadata: Metadata = { title: "End users" };

export default function EndUsersPage() {
  return <EndUsers />;
}
