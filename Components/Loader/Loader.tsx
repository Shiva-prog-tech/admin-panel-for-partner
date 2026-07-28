import { cx } from "@/utils/helper";

interface LoaderProps {
  label?: string;
  size?: "sm" | "lg";
  block?: boolean;
  className?: string;
}

export default function Loader({
  label,
  size = "sm",
  block = false,
  className,
}: LoaderProps) {
  const spinner = <span className={cx("spinner", size === "lg" && "spinner--lg")} />;

  if (!block) return spinner;

  return (
    <div className={cx("loader-block", className)} role="status" aria-live="polite">
      {spinner}
      {label && <span>{label}</span>}
    </div>
  );
}

/** Row placeholders used while a table is fetching. */
export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div style={{ padding: "14px 18px", display: "grid", gap: 10 }}>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: 20, opacity: 1 - i * 0.06 }}
        />
      ))}
    </div>
  );
}
