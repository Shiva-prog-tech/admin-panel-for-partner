import type { Metadata } from "next";
import SignUp from "@/modules/SignUpModule";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Partner Portal account and explore all features.",
};

export default function SignUpPage() {
  return <SignUp />;
}
