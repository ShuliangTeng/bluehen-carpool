import Link from "next/link";
import { CalendarIcon, CarIcon, ClockIcon, SeatIcon } from "@/components/icons";
import { Initials } from "@/components/initials";
import { chipClass, kindPill, routeTitle } from "@/components/styles";
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
      className="block rounded-2xl border border-line bg-white p-5 shadow-sm transition duration-150 hover:border-hen/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen active:translate-y-px"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={kindPill}>
          {offer ? (
            <CarIcon className="h-3.5 w-3.5 text-hen" />
          ) : (
            <SeatIcon className="h-3.5 w-3.5 text-hen" />
          )}
          {kindLabel(ride.kind)}
        </span>
        {showStatus ? (
          <span className="rounded-xl bg-paper px-2.5 py-1 text-xs font-semibold text-muted">
            {statusLabel(ride.status as RideStatus)}
          </span>
        ) : null}
      </div>
      <h2 className={`mt-3 ${routeTitle}`}>
        {ride.origin} <span className="text-hen">→</span> {ride.destination}
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={chipClass}>
          <CalendarIcon className="h-4 w-4 shrink-0 text-hen" />
          {formatDate(ride.trip_date)}
        </span>
        <span className={chipClass}>
          <ClockIcon className="h-4 w-4 shrink-0 text-hen" />
          {formatTime(ride.departure_time)}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">
        {seatLabel(ride.kind, ride.seats)}
        <span className="px-1.5 text-line" aria-hidden="true">
          ·
        </span>
        <span className="font-medium text-ink">{priceLabel(ride.kind, ride.price)}</span>
      </p>
      <p className="mt-4 flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2 text-sm text-muted">
          <Initials name={name} />
          <span className="truncate">{name}</span>
        </span>
        <span className="shrink-0 text-sm font-semibold text-hen">View ride</span>
      </p>
    </Link>
  );
}
