import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth-forms";
import { getViewer } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignupPage() {
  const viewer = await getViewer();
  if (viewer) {
    redirect("/board");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold">Join the ride board</h1>
      <p className="mt-2 text-muted">
        Use your email and a password. We will send a confirmation link, not a
        code.
      </p>
      <div className="mt-6 rounded-3xl border border-line bg-white p-6">
        <SignupForm />
      </div>
    </div>
  );
}
