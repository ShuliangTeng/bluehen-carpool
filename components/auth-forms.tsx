"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp } from "@/app/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { alertError, alertOk, fieldClass, helperClass, hintClass, labelClass } from "@/components/styles";

export function LoginForm({ confirmed }: { confirmed: boolean }) {
  const [state, action] = useActionState(signIn, { error: null });

  return (
    <form key={state.attempt ?? 0} action={action} className="space-y-5">
      {confirmed ? (
        <p role="status" className={alertOk}>
          Email confirmed. Log in with your password.
        </p>
      ) : null}
      {state.error ? (
        <p role="alert" className={alertError}>
          {state.error}
        </p>
      ) : null}
      <label className={labelClass}>
        Email
        <span className={hintClass}>Required</span>
        <input
          className={fieldClass}
          type="email"
          name="email"
          autoComplete="email"
          required
          defaultValue={state.email ?? ""}
        />
      </label>
      <label className={labelClass}>
        Password
        <span className={hintClass}>Required</span>
        <input
          className={fieldClass}
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </label>
      <SubmitButton label="Log in" pendingLabel="Logging in..." />
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-hen">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const [state, action] = useActionState(signUp, { error: null });

  return (
    <form key={state.attempt ?? 0} action={action} className="space-y-5">
      {state.error ? (
        <p role="alert" className={alertError}>
          {state.error}
        </p>
      ) : null}
      <label className={labelClass}>
        Name
        <span className={hintClass}>Required</span>
        <span className={helperClass}>The name other students will see.</span>
        <input
          className={fieldClass}
          name="fullName"
          autoComplete="name"
          required
          minLength={2}
          maxLength={40}
          placeholder="Liam Chen"
          defaultValue={state.fullName ?? ""}
        />
      </label>
      <label className={labelClass}>
        Email
        <span className={hintClass}>Required</span>
        <input
          className={fieldClass}
          type="email"
          name="email"
          autoComplete="email"
          required
          defaultValue={state.email ?? ""}
        />
      </label>
      <label className={labelClass}>
        Password
        <span className={hintClass}>Required</span>
        <span className={helperClass}>At least 8 characters.</span>
        <input
          className={fieldClass}
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </label>
      <label className={labelClass}>
        Confirm password
        <span className={hintClass}>Required</span>
        <input
          className={fieldClass}
          type="password"
          name="confirm"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </label>
      <SubmitButton label="Create account" pendingLabel="Creating account..." />
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-hen">
          Log in
        </Link>
      </p>
    </form>
  );
}
