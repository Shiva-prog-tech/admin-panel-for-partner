import type { Metadata } from "next";
import SignIn from "@/modules/Auth/SignIn";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the Partner Portal to manage your operations.",
};

export default function SignInPage() {
  return <SignIn />;
}
