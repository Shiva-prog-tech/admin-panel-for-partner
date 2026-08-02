import AuthGate from "@/Components/AuthWrapper";
import AppShell from "@/Components/DashboardWrapper";

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
