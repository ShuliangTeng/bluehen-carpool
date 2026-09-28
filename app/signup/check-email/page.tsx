import type { Metadata } from "next";
import Link from "next/link";
import { pageLead, pageTitle, primaryButton } from "@/components/styles";

export const metadata: Metadata = {
  title: "Check your email",
};

export default function CheckEmailPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className={pageTitle}>Check your email</h1>
      <p className={`${pageLead} text-lg leading-8`}>
        We sent you a confirmation link. Open that link, then come back and log
        in with the same password. There is no 6-digit code to type.
      </p>
      <Link href="/login" className={`${primaryButton} mt-8`}>
        Go to log in
      </Link>
    </div>
  );
}
