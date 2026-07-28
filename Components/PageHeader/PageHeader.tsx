import type { ReactNode } from "react";
import Link from "next/link";
import Icon from "@/Components/Icons/Icon";

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
    <div className="page-head">
      <div>
        <h1 className="page-head__title">{title}</h1>

        {crumbs && crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1;
              return (
                <span key={`${crumb.label}-${index}`} className="u-row" style={{ gap: 7 }}>
                  {crumb.href && !last ? (
                    <Link href={crumb.href} className="crumbs__link">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={last ? "crumbs__current" : undefined}>
                      {crumb.label}
                    </span>
                  )}
                  {!last && (
                    <span className="crumbs__sep" aria-hidden="true">
                      <Icon name="chevronRight" size={13} />
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        {subtitle && <div className="page-head__sub">{subtitle}</div>}
      </div>

      {actions && <div className="page-head__actions">{actions}</div>}
    </div>
  );
}
