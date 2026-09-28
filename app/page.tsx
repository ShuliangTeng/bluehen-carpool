import type { Metadata } from "next";
import Link from "next/link";
import { PostChoices } from "@/components/post-choices";
import { chipClass, kindPill, pageLead, primaryButton, secondaryButton } from "@/components/styles";
import { getViewer } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Welcome",
};

const steps = [
  ["1", "Post a trip", "Offer seats in your car, or ask for a ride you need."],
  ["2", "Browse the board", "Look for the same destination, date, and time."],
  ["3", "Confirm together", "When a response is accepted, both of you see it in My Trips."],
];

export default async function HomePage() {
  const viewer = await getViewer();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-hen">
          University of Delaware · Newark
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Offer a ride, or find one.
        </h1>
        <p className="mt-4 text-lg leading-8 text-ink">
          BlueHen CarPool helps UD students offer rides or find rides with other students.
        </p>
        <p className={pageLead}>
          Heading to the store, the mall, Philadelphia, or home? Post an open seat, or look for a student who is already going.
        </p>
        {viewer ? (
          <div className="mt-8 space-y-4">
            <PostChoices />
            <Link href="/board" className={primaryButton}>
              See the ride board
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <PostChoices linked={false} />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className={primaryButton}>
                Create a free account
              </Link>
              <Link href="/login" className={secondaryButton}>
                I already have an account
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {steps.map(([step, title, body]) => (
          <article key={step} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-hen">Step {step}</p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-hen">Example</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Liam needs a ride to New York</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
          Liam wants to go to New York City on Friday evening. He finds a UD student leaving Newark at 5:30 PM with two seats left, requests one seat, and the driver accepts. Both of them see the trip as confirmed.
        </p>
        <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
          <span className={kindPill}>Offer</span>
          <p className="mt-3 break-words text-2xl font-semibold tracking-tight text-ink">
            Newark <span className="text-hen">→</span> New York City
          </p>
          <p className="mt-3 flex flex-wrap gap-2">
            <span className={chipClass}>Friday</span>
            <span className={chipClass}>5:30 PM</span>
            <span className={chipClass}>2 seats left</span>
            <span className={chipClass}>$25 per seat</span>
          </p>
        </div>
      </section>
    </div>
  );
}
