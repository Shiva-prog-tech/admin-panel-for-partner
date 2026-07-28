import Link from "next/link";
import Icon from "@/Components/Icons/Icon";

export default function NotFound() {
  return (
    <div className="empty-state" style={{ padding: "96px 20px" }}>
      <span className="empty-state__icon">
        <Icon name="search" size={24} />
      </span>
      <h1 className="empty-state__title" style={{ fontSize: 20 }}>
        Page not found
      </h1>
      <p className="empty-state__text">
        The record or page you were looking for is not part of this workspace.
      </p>
      <Link href="/" className="btn btn--brand" style={{ marginTop: 6 }}>
        <Icon name="dashboard" size={16} />
        Back to dashboard
      </Link>
    </div>
  );
}
