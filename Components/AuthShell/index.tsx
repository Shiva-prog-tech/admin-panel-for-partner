import type { ReactNode } from "react";
import BrandMark from "@/Components/Icons/BrandMark";
import Icon from "@/Components/Icons";
import LanguageSelect from "@/Components/LanguageSelect";
import { AuthDots, AuthWaves } from "@/Components/Illustrations/AuthDecor";
import { APP_NAME, APP_TAGLINE, LEGAL_LINE } from "@/types/constants";
import styles from "./AuthShell.module.scss";

interface AuthShellProps {
  /** left panel headline — may include an emoji */
  heading: ReactNode;
  blurb: string;
  art: ReactNode;
  children: ReactNode;
}

/**
 * Split auth layout: a warm brand aside on the left, the form on the right.
 * The aside collapses below 900px and the brand moves inline above the form.
 */
export default function AuthShell({
  heading,
  blurb,
  art,
  children,
}: AuthShellProps) {
  const brand = (
    <div className={styles.brand}>
      <BrandMark size={34} />
      <div>
        <div className={styles.brandName}>{APP_NAME}</div>
        <div className={styles.brandTagline}>{APP_TAGLINE}</div>
      </div>
    </div>
  );

  return (
    <div className={styles.auth}>
      <div className={styles.card}>
        <aside className={styles.aside}>
          <AuthWaves className={styles.waves} />
          <AuthDots className={styles.dots} />

          <div className={styles.asideInner}>
            {brand}

            <div className={styles.intro}>
              <h1 className={styles.heading}>{heading}</h1>
              <p className={styles.blurb}>{blurb}</p>
            </div>

            <div className={styles.art}>{art}</div>

            <div className={styles.trust}>
              <span className={styles.trustIcon}>
                <Icon name="lock" size={17} />
              </span>
              <div>
                <div className={styles.trustTitle}>Secure &amp; Trusted</div>
                <p className={styles.trustText}>
                  Your data is encrypted and protected 24/7
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.mainTop}>
            <div className={styles.brandCompact}>{brand}</div>
            <LanguageSelect />
          </div>

          <div className={styles.formWrap}>{children}</div>

          <p className={styles.legal}>{LEGAL_LINE}</p>
        </main>
      </div>
    </div>
  );
}
