import Link from "next/link";
import Icon, { type IconName } from "@/Components/Icons";
import { QUICK_LINKS } from "@/types/constants";
import { panelStyles } from "@/Components/PanelCard";
import styles from "./QuickLinks.module.scss";

export default function QuickLinks() {
  return (
    <section className={panelStyles.card}>
      <h2 className={panelStyles.title}>Quick links</h2>

      <div className={styles.grid}>
        {QUICK_LINKS.map((link) => (
          <Link key={link.label} href={link.href} className={styles.link}>
            <Icon name={link.icon as IconName} size={21} />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
