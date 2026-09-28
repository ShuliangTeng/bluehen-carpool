import type { Metadata } from "next";
import Link from "next/link";
import { primaryButton } from "@/components/styles";

export const metadata: Metadata = {
  title: "Check your email",
};

export default function CheckEmailPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-3xl font-bold">Check your email</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        We sent you a confirmation link. Open that link, then come back and log
        in with the same password. There is no 6-digit code to type.
      </p>
      <Link href="/login" className={`${primaryButton} mt-8`}>
        Go to log in
      </Link>
    </div>
  );
}
