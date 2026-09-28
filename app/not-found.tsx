import Link from "next/link";
import { pageLead, pageTitle, primaryButton } from "@/components/styles";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className={pageTitle}>We could not find that page</h1>
      <p className={pageLead}>The ride may have been deleted, or the link is old.</p>
      <Link href="/board" className={`${primaryButton} mt-8`}>
        Back to the ride board
      </Link>
    </div>
  );
}
