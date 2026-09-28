import type { Metadata } from "next";
import Link from "next/link";
import { PostChoices } from "@/components/post-choices";
import { goldButton, primaryButton, secondaryButton } from "@/components/styles";
import { getViewer } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Welcome",
};

export default async function HomePage() {
  const viewer = await getViewer();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-hen">
          University of Delaware · Newark
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Find a ride. Fill an empty seat.
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Many UD students do not have a car on campus, but they still need a way
          to the grocery store, the mall, Philadelphia, New York, or home. Other
          students are already driving and have empty seats. BlueHen CarPool is
          where those trips can meet.
        </p>
        {viewer ? (
          <div className="mt-8 space-y-4">
            <PostChoices />
            <Link href="/board" className={primaryButton}>
              See the ride board
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className={goldButton}>
              Create a free account
            </Link>
            <Link href="/login" className={secondaryButton}>
              I already have an account
            </Link>
          </div>
        )}
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          ["1", "Post a trip", "Offer seats in your car, or ask for a ride you need."],
          ["2", "Browse the board", "Look for the same destination, date, and time."],
          ["3", "Confirm together", "Request a seat. When it is accepted, both of you see it in My Trips."],
        ].map(([step, title, body]) => (
          <article key={step} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-hen">Step {step}</p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
          </article>
        ))}
      </section>

      <section className="mt-14 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-hen">Example</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Liam needs a ride to New York</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
          Liam wants to go to New York City on Friday evening, and he does not want
          to drive. He opens the ride board and finds another UD student leaving
          Newark at 5:30 PM with two seats left for $25 per seat. He requests
          one seat. The driver accepts. Both of them see the trip as confirmed.
        </p>
        <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
          <span className="rounded-xl border border-gold bg-gold/25 px-2.5 py-1 text-xs font-semibold tracking-wide text-hen-dark">
            Offer
          </span>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            Newark <span className="text-hen">→</span> New York City
          </p>
          <p className="mt-3 flex flex-wrap gap-2 text-sm font-medium">
            <span className="rounded-xl bg-white px-2.5 py-1">Friday</span>
            <span className="rounded-xl bg-white px-2.5 py-1">5:30 PM</span>
            <span className="rounded-xl bg-white px-2.5 py-1">2 seats left</span>
            <span className="rounded-xl bg-white px-2.5 py-1">$25 per seat</span>
          </p>
        </div>
      </section>
    </div>
  );
}
