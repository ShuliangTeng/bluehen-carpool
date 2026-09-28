import type { Metadata } from "next";
import Link from "next/link";
import { primaryButton, secondaryButton } from "@/components/styles";

export const metadata: Metadata = {
  title: "Confirmation link problem",
};

export default function AuthCodeErrorPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-3xl font-bold">That link did not work</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        The confirmation link may have expired, or it was already used. If you
        already confirmed your email, log in with your password. Otherwise, sign
        up again.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/login" className={primaryButton}>
          Log in
        </Link>
        <Link href="/signup" className={secondaryButton}>
          Sign up
        </Link>
      </div>
    </div>
  );
}
