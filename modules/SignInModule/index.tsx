"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/Components/AuthShell";
import SocialButtons from "@/Components/SocialButtons";
import TextField from "@/Components/TextField";
import PasswordField from "@/Components/PasswordField";
import Checkbox from "@/Components/Checkbox";
import Icon from "@/Components/Icons";
import ShieldLockArt from "@/Components/Illustrations/ShieldLockArt";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signInFailure, signInStart, signInSuccess } from "@/redux/reducers/AuthReducer";
import { pushToast } from "@/redux/reducers/ToastReducer";
import authService, { AuthError } from "@/services/auth.service";
import { AUTH_ROUTES } from "@/types/constants";
import { cx } from "@/utils/helper";
import { loaderStyles } from "@/Components/Loader";
import { writeSession } from "@/utils/session";
import styles from "@/Components/AuthShell/AuthShell.module.scss";
import { buttonStyles } from "@/Components/Button";

export default function SignIn() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, user, hydrated } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const busy = status === "loading";

  // Already signed in — don't show the form again.
  useEffect(() => {
    if (hydrated && user) router.replace(AUTH_ROUTES.afterSignIn);
  }, [hydrated, user, router]);

  const submit = async () => {
    if (busy) return;
    setErrors({});
    setFormError(null);
    dispatch(signInStart());

    try {
      const session = await authService.signIn({ email, password, remember });
      writeSession(session);
      dispatch(signInSuccess(session.user));
      dispatch(
        pushToast({
          tone: "success",
          title: `Welcome back, ${session.user.name}`,
          text: "Signed in to Travls Live.",
        })
      );
      router.replace(AUTH_ROUTES.afterSignIn);
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : "We could not sign you in. Please try again.";
      if (error instanceof AuthError && error.field) {
        setErrors({ [error.field]: message });
      } else {
        setFormError(message);
      }
      dispatch(signInFailure(message));
    }
  };

  return (
    <AuthShell
      heading={
        <>
          Welcome back! <span className={styles.emoji}>👋</span>
        </>
      }
      blurb="Sign in to continue managing your operations seamlessly."
      art={<ShieldLockArt className={styles.artSvg} />}
    >
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        noValidate
      >
        <header className={styles.formHead}>
          <h2 className={styles.formTitle}>Sign in</h2>
          <p className={styles.formSub}>
            Enter your credentials to access your account
          </p>
        </header>

        <TextField
          id="signin-email"
          label="Email address"
          type="email"
          icon="mail"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setErrors((e) => ({ ...e, email: "" }));
          }}
          error={errors.email || null}
        />

        <PasswordField
          id="signin-password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setErrors((e) => ({ ...e, password: "" }));
          }}
          error={errors.password || null}
        />

        <div className={styles.formRow}>
          <Checkbox id="signin-remember" checked={remember} onChange={setRemember}>
            Remember me
          </Checkbox>
          <Link href="/sign-in" className={styles.link}>
            Forgot password?
          </Link>
        </div>

        {formError && (
          <p className={styles.formError} role="alert">
            <Icon name="alert" size={15} />
            {formError}
          </p>
        )}

        <button type="submit" className={cx(buttonStyles.btn, buttonStyles.brand, styles.submit)} disabled={busy}>
          <span>{busy ? "Signing in…" : "Sign in"}</span>
          {busy ? (
            <span className={cx(loaderStyles.spinner, styles.submitIcon)} />
          ) : (
            <Icon name="arrowRight" size={18} className={styles.submitIcon} />
          )}
        </button>

        <SocialButtons disabled={busy} />

        <p className={styles.formFoot}>
          Don&apos;t have an account?{" "}
          <Link href={AUTH_ROUTES.signUp} className={cx(styles.link, styles.linkArrow)}>
            Sign up
            <Icon name="arrowRight" size={15} />
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
