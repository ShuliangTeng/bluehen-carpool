"use client";

import { primaryButton } from "@/components/styles";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-muted">Please try that again.</p>
      <button type="button" onClick={reset} className={`${primaryButton} mt-6`}>
        Try again
      </button>
    </div>
  );
}
