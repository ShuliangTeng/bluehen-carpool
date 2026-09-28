"use client";

import { useFormStatus } from "react-dom";
import { primaryButton } from "@/components/styles";

export function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={`${primaryButton} w-full`} disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}
