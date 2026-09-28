import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth-forms";
import { pageLead, pageTitle } from "@/components/styles";
import { getViewer } from "@/lib/auth";
import { oneParam } from "@/lib/format";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const viewer = await getViewer();
  if (viewer) {
    redirect("/board");
  }

  const params = await searchParams;
  const confirmed = oneParam(params.confirmed) === "1";

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className={pageTitle}>Welcome back</h1>
      <p className={pageLead}>
        Log in with the email and password you signed up with.
      </p>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <LoginForm confirmed={confirmed} />
      </div>
    </div>
  );
}
