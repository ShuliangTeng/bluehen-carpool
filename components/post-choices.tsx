import Link from "next/link";
import { CarIcon, SeatIcon } from "@/components/icons";

export function PostChoices({
  selected,
}: {
  selected?: "offer" | "request";
}) {
  const offerSelected = selected === "offer";
  const requestSelected = selected === "request";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link
        href="/rides/new?kind=offer"
        className={`rounded-2xl border-2 bg-white p-4 transition duration-150 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen active:translate-y-0 ${
          offerSelected ? "border-gold shadow-sm" : "border-gold/70"
        }`}
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold/30 text-hen-dark">
          <CarIcon />
        </span>
        <span className="mt-3 block text-lg font-semibold tracking-tight text-ink">
          Offer a ride
        </span>
        <span className="mt-1 block text-sm leading-6 text-muted">
          I’m driving and have available seats.
        </span>
      </Link>
      <Link
        href="/rides/new?kind=request"
        className={`rounded-2xl border-2 bg-white p-4 transition duration-150 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen active:translate-y-0 ${
          requestSelected ? "border-hen shadow-sm" : "border-hen/30"
        }`}
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-hen/10 text-hen">
          <SeatIcon />
        </span>
        <span className="mt-3 block text-lg font-semibold tracking-tight text-ink">
          Request a ride
        </span>
        <span className="mt-1 block text-sm leading-6 text-muted">
          I need a ride to a destination.
        </span>
      </Link>
    </div>
  );
}
