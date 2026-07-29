"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "./AuthShell";
import SocialButtons from "./SocialButtons";
import TextField from "@/Components/Forms/TextField";
import PasswordField from "@/Components/Forms/PasswordField";
import Checkbox from "@/Components/Forms/Checkbox";
import Icon from "@/Components/Icons/Icon";
import ShieldLockArt from "@/Components/Illustrations/ShieldLockArt";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signInFailure, signInStart, signInSuccess } from "@/redux/reducers/authSlice";
import { pushToast } from "@/redux/reducers/toastSlice";
import authService, { AuthError } from "@/services/auth.service";
import { AUTH_ROUTES } from "@/types/constants";
import { writeSession } from "@/utils/session";

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
          Welcome back! <span className="auth__emoji">👋</span>
        </>
      }
      blurb="Sign in to continue managing your operations seamlessly."
      art={<ShieldLockArt className="auth__art-svg" />}
    >
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        noValidate
      >
        <header className="auth-form__head">
          <h2 className="auth-form__title">Sign in</h2>
          <p className="auth-form__sub">
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

        <div className="auth-form__row">
          <Checkbox id="signin-remember" checked={remember} onChange={setRemember}>
            Remember me
          </Checkbox>
          <Link href="/sign-in" className="auth-form__link">
            Forgot password?
          </Link>
        </div>

        {formError && (
          <p className="auth-form__error" role="alert">
            <Icon name="alert" size={15} />
            {formError}
          </p>
        )}

        <button type="submit" className="btn btn--brand auth-form__submit" disabled={busy}>
          <span>{busy ? "Signing in…" : "Sign in"}</span>
          {busy ? (
            <span className="spinner auth-form__submit-icon" />
          ) : (
            <Icon name="arrowRight" size={18} className="auth-form__submit-icon" />
          )}
        </button>

        <SocialButtons disabled={busy} />

        <p className="auth-form__foot">
          Don&apos;t have an account?{" "}
          <Link href={AUTH_ROUTES.signUp} className="auth-form__link auth-form__link--arrow">
            Sign up
            <Icon name="arrowRight" size={15} />
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
