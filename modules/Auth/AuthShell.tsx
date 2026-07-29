import type { ReactNode } from "react";
import BrandMark from "@/Components/Icons/BrandMark";
import Icon from "@/Components/Icons/Icon";
import LanguageSelect from "@/Components/LanguageSelect/LanguageSelect";
import { AuthDots, AuthWaves } from "@/Components/Illustrations/AuthDecor";
import { APP_NAME, APP_TAGLINE, LEGAL_LINE } from "@/types/constants";

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
    <div className="auth__brand">
      <BrandMark size={34} />
      <div>
        <div className="auth__brand-name">{APP_NAME}</div>
        <div className="auth__brand-tagline">{APP_TAGLINE}</div>
      </div>
    </div>
  );

  return (
    <div className="auth">
      <div className="auth__card">
        <aside className="auth__aside">
          <AuthWaves className="auth__waves" />
          <AuthDots className="auth__dots" />

          <div className="auth__aside-inner">
            {brand}

            <div className="auth__intro">
              <h1 className="auth__heading">{heading}</h1>
              <p className="auth__blurb">{blurb}</p>
            </div>

            <div className="auth__art">{art}</div>

            <div className="auth__trust">
              <span className="auth__trust-icon">
                <Icon name="lock" size={17} />
              </span>
              <div>
                <div className="auth__trust-title">Secure &amp; Trusted</div>
                <p className="auth__trust-text">
                  Your data is encrypted and protected 24/7
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="auth__main">
          <div className="auth__main-top">
            <div className="auth__brand-compact">{brand}</div>
            <LanguageSelect />
          </div>

          <div className="auth__form-wrap">{children}</div>

          <p className="auth__legal">{LEGAL_LINE}</p>
        </main>
      </div>
    </div>
  );
}
