import Link from "next/link";
import Icon, { type IconName } from "@/Components/Icons/Icon";
import { QUICK_LINKS } from "@/types/constants";

export default function QuickLinks() {
  return (
    <section className="panel-card quick-links">
      <h2 className="panel-card__title">Quick links</h2>

      <div className="quick-links__grid u-mt-md">
        {QUICK_LINKS.map((link) => (
          <Link key={link.label} href={link.href} className="quick-link">
            <Icon name={link.icon as IconName} size={21} />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
