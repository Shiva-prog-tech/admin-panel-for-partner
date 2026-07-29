"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "./AuthShell";
import SocialButtons from "./SocialButtons";
import TextField from "@/Components/Forms/TextField";
import PasswordField from "@/Components/Forms/PasswordField";
import Checkbox from "@/Components/Forms/Checkbox";
import Icon from "@/Components/Icons/Icon";
import ProfileCardArt from "@/Components/Illustrations/ProfileCardArt";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signInFailure, signInStart, signInSuccess } from "@/redux/reducers/authSlice";
import { pushToast } from "@/redux/reducers/toastSlice";
import authService, { AuthError } from "@/services/auth.service";
import { AUTH_ROUTES, PASSWORD_RULES } from "@/types/constants";
import { writeSession } from "@/utils/session";
import { cx } from "@/utils/helper";

export default function SignUp() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, user, hydrated } = useAppSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const busy = status === "loading";

  const rules = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(password) })),
    [password]
  );

  useEffect(() => {
    if (hydrated && user) router.replace(AUTH_ROUTES.afterSignIn);
  }, [hydrated, user, router]);

  const submit = async () => {
    if (busy) return;
    setErrors({});
    setFormError(null);

    if (confirm !== password) {
      setErrors({ confirm: "Passwords do not match." });
      return;
    }
    if (!agreed) {
      setFormError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    dispatch(signInStart());

    try {
      const session = await authService.signUp({ fullName, email, password });
      writeSession(session);
      dispatch(signInSuccess(session.user));
      dispatch(
        pushToast({
          tone: "success",
          title: "Account created",
          text: `Welcome aboard, ${session.user.name}.`,
        })
      );
      router.replace(AUTH_ROUTES.afterSignIn);
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : "We could not create your account. Please try again.";
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
          Create your account <span className="auth__emoji">✨</span>
        </>
      }
      blurb="Get started with your free account and explore all features."
      art={<ProfileCardArt className="auth__art-svg" />}
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
          <h2 className="auth-form__title">Create account</h2>
          <p className="auth-form__sub">Fill in the details to create your account</p>
        </header>

        <TextField
          id="signup-name"
          label="Full name"
          icon="user"
          autoComplete="name"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(value) => {
            setFullName(value);
            setErrors((e) => ({ ...e, fullName: "" }));
          }}
          error={errors.fullName || null}
        />

        <TextField
          id="signup-email"
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
          id="signup-password"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setErrors((e) => ({ ...e, password: "" }));
          }}
          error={errors.password || null}
        />

        <PasswordField
          id="signup-confirm"
          label="Confirm password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          value={confirm}
          onChange={(value) => {
            setConfirm(value);
            setErrors((e) => ({ ...e, confirm: "" }));
          }}
          error={errors.confirm || null}
        />

        <ul className="auth-rules">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className={cx("auth-rules__item", rule.met && "auth-rules__item--met")}
            >
              <Icon name="checkCircle" size={15} />
              <span>{rule.label}</span>
            </li>
          ))}
        </ul>

        <Checkbox
          id="signup-terms"
          checked={agreed}
          onChange={(next) => {
            setAgreed(next);
            setFormError(null);
          }}
          error={Boolean(formError) && !agreed}
        >
          I agree to the{" "}
          <Link href="/sign-up" className="auth-form__link">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/sign-up" className="auth-form__link">
            Privacy Policy
          </Link>
        </Checkbox>

        {formError && (
          <p className="auth-form__error" role="alert">
            <Icon name="alert" size={15} />
            {formError}
          </p>
        )}

        <button type="submit" className="btn btn--brand auth-form__submit" disabled={busy}>
          <span>{busy ? "Creating account…" : "Create account"}</span>
          {busy ? (
            <span className="spinner auth-form__submit-icon" />
          ) : (
            <Icon name="arrowRight" size={18} className="auth-form__submit-icon" />
          )}
        </button>

        <SocialButtons disabled={busy} />

        <p className="auth-form__foot">
          Already have an account?{" "}
          <Link href={AUTH_ROUTES.signIn} className="auth-form__link auth-form__link--arrow">
            Sign in
            <Icon name="arrowRight" size={15} />
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
