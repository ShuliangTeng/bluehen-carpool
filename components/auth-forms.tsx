"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp } from "@/app/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { fieldClass, labelClass } from "@/components/styles";

export function LoginForm({ confirmed }: { confirmed: boolean }) {
  const [state, action] = useActionState(signIn, { error: null });

  return (
    <form key={state.attempt ?? 0} action={action} className="space-y-4">
      {confirmed ? (
        <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-900">
          Email confirmed. Log in with your password.
        </p>
      ) : null}
      {state.error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <label className={labelClass}>
        Email
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
    <form key={state.attempt ?? 0} action={action} className="space-y-4">
      {state.error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <label className={labelClass}>
        Name
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
