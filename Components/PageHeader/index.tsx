import type { ReactNode } from "react";
import Link from "next/link";
import Icon from "@/Components/Icons";
import styles from "./PageHeader.module.scss";

export interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  /** plain sub-line, e.g. "Travls Live · live environment" */
  subtitle?: ReactNode;
  /** breadcrumb trail, e.g. Dashboard › End users */
  crumbs?: Crumb[];
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  crumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className={styles.head}>
      <div>
        <h1 className={styles.title}>{title}</h1>

        {crumbs && crumbs.length > 0 && (
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1;
              return (
                <span key={`${crumb.label}-${index}`} className={styles.crumb}>
                  {crumb.href && !last ? (
                    <Link href={crumb.href} className={styles.link}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={last ? styles.current : undefined}>
                      {crumb.label}
                    </span>
                  )}
                  {!last && (
                    <span className={styles.sep} aria-hidden="true">
                      <Icon name="chevronRight" size={13} />
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        {subtitle && <div className={styles.sub}>{subtitle}</div>}
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
