import ToastHost from "@/Components/Toast/ToastHost";

/**
 * Auth screens render without the backoffice chrome. ToastHost is mounted here
 * so provider errors and sign-in confirmations are still visible.
 */
export default function AuthGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <ToastHost />
    </>
  );
}
