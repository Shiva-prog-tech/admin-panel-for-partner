"use client";

import { GoogleLogo, MicrosoftLogo } from "@/Components/Icons/BrandLogos";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/ToastReducer";
import authService, { AuthError } from "@/services/auth.service";
import styles from "@/Components/AuthShell/AuthShell.module.scss";

/** "or continue with" — Google / Microsoft federated sign-in. */
export default function SocialButtons({ disabled }: { disabled?: boolean }) {
  const dispatch = useAppDispatch();

  const attempt = async (provider: "google" | "microsoft") => {
    try {
      await authService.signInWithProvider(provider);
    } catch (error) {
      dispatch(
        pushToast({
          tone: "info",
          title: provider === "google" ? "Google" : "Microsoft",
          text:
            error instanceof AuthError
              ? error.message
              : "Federated sign-in is unavailable right now.",
        })
      );
    }
  };

  return (
    <>
      <div className={styles.divider}>
        <span>or continue with</span>
      </div>

      <div className={styles.social}>
        <button
          type="button"
          className={styles.socialBtn}
          disabled={disabled}
          onClick={() => attempt("google")}
        >
          <GoogleLogo size={18} />
          <span>Google</span>
        </button>
        <button
          type="button"
          className={styles.socialBtn}
          disabled={disabled}
          onClick={() => attempt("microsoft")}
        >
          <MicrosoftLogo size={18} />
          <span>Microsoft</span>
        </button>
      </div>
    </>
  );
}
