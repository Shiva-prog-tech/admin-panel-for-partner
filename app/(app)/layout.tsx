import AuthGate from "@/Components/AuthGate/AuthGate";
import AppShell from "@/Components/AppShell/AppShell";

/** Everything behind the session guard renders inside the backoffice chrome. */
export default function AppGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
