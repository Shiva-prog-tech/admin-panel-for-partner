import Link from "next/link";
import Icon from "@/Components/Icons";
import { buttonStyles } from "@/Components/Button";
import { cx } from "@/utils/helper";
import styles from "./NotFound.module.scss";

/**
 * Global 404. Rendered outside the backoffice chrome, so it centres itself.
 */
export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.body}>
        <span className={styles.icon}>
          <Icon name="search" size={24} />
        </span>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.text}>
          The record or page you were looking for is not part of this workspace.
        </p>
        <Link
          href="/"
          className={cx(buttonStyles.btn, buttonStyles.brand, styles.action)}
        >
          <Icon name="dashboard" size={16} />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
