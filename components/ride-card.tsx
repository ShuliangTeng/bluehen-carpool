import Link from "next/link";
import { CalendarIcon, ClockIcon } from "@/components/icons";
import { Initials } from "@/components/initials";
import { chipClass } from "@/components/styles";
import {
  formatDate,
  formatTime,
  kindLabel,
  priceLabel,
  profileName,
  seatLabel,
  statusLabel,
} from "@/lib/format";
import type { RideRecord, RideStatus } from "@/lib/types";

export function RideCard({
  ride,
  showStatus = false,
}: {
  ride: RideRecord;
  showStatus?: boolean;
}) {
  const name = profileName(ride.profiles);
  const offer = ride.kind === "offer";

  return (
    <Link
      href={`/rides/${ride.id}`}
      className="block rounded-2xl border border-line bg-white p-5 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-hen/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={
            offer
              ? "rounded-xl border border-gold bg-gold/25 px-2.5 py-1 text-xs font-semibold tracking-wide text-hen-dark"
              : "rounded-xl border border-hen/30 bg-hen/5 px-2.5 py-1 text-xs font-semibold tracking-wide text-hen"
          }
        >
          {kindLabel(ride.kind)}
        </span>
        {showStatus ? (
          <span className="rounded-xl bg-paper px-2.5 py-1 text-xs font-semibold text-muted">
            {statusLabel(ride.status as RideStatus)}
          </span>
        ) : null}
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        {ride.origin} <span className="text-hen">→</span> {ride.destination}
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={chipClass}>
          <CalendarIcon className="h-4 w-4 text-hen" />
          {formatDate(ride.trip_date)}
        </span>
        <span className={chipClass}>
          <ClockIcon className="h-4 w-4 text-hen" />
          {formatTime(ride.departure_time)}
        </span>
        <span className={chipClass}>{seatLabel(ride.kind, ride.seats)}</span>
        <span className={chipClass}>{priceLabel(ride.kind, ride.price)}</span>
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm font-medium text-ink">
        <Initials name={name} />
        {name}
      </p>
    </Link>
  );
}
