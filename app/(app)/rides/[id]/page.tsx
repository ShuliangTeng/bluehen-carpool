import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  acceptResponse,
  cancelRide,
  createResponse,
  declineResponse,
  deleteRide,
  withdrawResponse,
} from "@/app/actions/rides";
import { CalendarIcon, CarIcon, ClockIcon, SeatIcon } from "@/components/icons";
import { Initials } from "@/components/initials";
import {
  alertError,
  alertOk,
  chipClass,
  dangerButton,
  fieldClass,
  hintClass,
  kindPill,
  labelClass,
  primaryButton,
  secondaryButton,
  textLink,
} from "@/components/styles";
import { requireViewer } from "@/lib/auth";
import {
  flashMessage,
  formatDate,
  formatTime,
  kindLabel,
  priceLabel,
  oneParam,
  profileName,
  seatLabel,
  statusLabel,
} from "@/lib/format";
import { normalizeRide } from "@/lib/rides";
import { createClient } from "@/lib/supabase/server";
import type { ResponseRecord, RideRecord } from "@/lib/types";

export const metadata: Metadata = {
  title: "Ride details",
};

export default async function RideDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const viewer = await requireViewer();
  const { id } = await params;
  const query = await searchParams;
  const notice = flashMessage(oneParam(query.notice), "notice");
  const error = flashMessage(oneParam(query.error), "error");
  const confirmDelete = oneParam(query.confirmDelete) === "1";
  const supabase = await createClient();

  const [rideResult, responseResult] = await Promise.all([
    supabase.from("rides").select("*, profiles(full_name)").eq("id", id).maybeSingle(),
    supabase
      .from("ride_responses")
      .select("*, profiles(full_name)")
      .eq("ride_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!rideResult.data) {
    notFound();
  }

  const ride = normalizeRide(rideResult.data as RideRecord);
  const responses = (responseResult.data ?? []) as ResponseRecord[];
  const isOwner = ride.user_id === viewer.id;
  const mine = responses.find((response) => response.user_id === viewer.id);
  const pending = responses.filter((response) => response.status === "pending");
  const accepted = responses.filter((response) => response.status === "accepted");
  const canRespond = !isOwner && !mine && ride.status === "open" && ride.seats > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/board" className={textLink}>
        Back to the ride board
      </Link>
      <article className="mt-4 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className={kindPill}>
            {ride.kind === "offer" ? (
              <CarIcon className="h-3.5 w-3.5 text-hen" />
            ) : (
              <SeatIcon className="h-3.5 w-3.5 text-hen" />
            )}
            {kindLabel(ride.kind)}
          </span>
          <span className="rounded-xl bg-paper px-2.5 py-1 text-xs font-semibold text-muted">
            {statusLabel(ride.status)}
          </span>
        </div>
        <h1 className="mt-4 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
          {ride.origin} <span className="text-hen">→</span> {ride.destination}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
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
        <p className="mt-4 flex items-center gap-2 text-sm text-muted">
          <Initials name={profileName(ride.profiles)} />
          Posted by <span className="font-medium text-ink">{profileName(ride.profiles)}</span>
        </p>
        {ride.notes ? <p className="mt-4 whitespace-pre-wrap text-ink">{ride.notes}</p> : null}
        {ride.kind === "offer" ? (
          <div className="mt-5 rounded-2xl bg-paper p-4 text-sm leading-6">
            <p>
              <span className="font-semibold">Vehicle: </span>
              {ride.vehicle}
            </p>
            <p>Driver says they have a valid license: {ride.has_license ? "Yes" : "No"}</p>
            <p>Driver says they have auto insurance: {ride.has_insurance ? "Yes" : "No"}</p>
            <p className="mt-2 text-muted">
              BlueHen CarPool does not verify licenses or insurance. Confirm the details
              with each other before you ride.
            </p>
          </div>
        ) : null}
      </article>

      {notice ? (
        <p role="status" className={`mt-4 ${alertOk}`}>
          {notice}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className={`mt-4 ${alertError}`}>
          {error}
        </p>
      ) : null}

      {isOwner ? (
        <section className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {ride.status === "open" ? (
              <Link href={`/rides/${ride.id}/edit`} className={secondaryButton}>
                Edit
              </Link>
            ) : null}
            {ride.status !== "cancelled" ? (
              <form action={cancelRide}>
                <input type="hidden" name="rideId" value={ride.id} />
                <button type="submit" className={secondaryButton}>
                  Cancel trip
                </button>
              </form>
            ) : null}
            {confirmDelete ? (
              <form action={deleteRide} className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="rideId" value={ride.id} />
                <p className="text-sm text-red-700">Delete this post for good?</p>
                <button type="submit" className={dangerButton}>
                  Yes, delete it
                </button>
                <Link href={`/rides/${ride.id}`} className={secondaryButton}>
                  Keep it
                </Link>
              </form>
            ) : (
              <Link href={`/rides/${ride.id}?confirmDelete=1`} className={dangerButton}>
                Delete
              </Link>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight">
              {ride.kind === "offer" ? "Seat requests" : "Drivers who responded"}
            </h2>
            {responses.length === 0 ? (
              <p className="mt-3 text-muted">No one has responded yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {responses.map((response) => (
                  <li key={response.id} className="rounded-2xl bg-paper p-4">
                    <p className="font-semibold">{profileName(response.profiles)}</p>
                    <p className="text-sm text-muted">
                      {response.seats} {response.seats === 1 ? "seat" : "seats"} ·{" "}
                      {statusLabel(response.status)}
                    </p>
                    {response.message ? <p className="mt-2 text-sm">{response.message}</p> : null}
                    {response.status === "pending" ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <form action={acceptResponse}>
                          <input type="hidden" name="responseId" value={response.id} />
                          <button type="submit" className={primaryButton}>
                            Accept
                          </button>
                        </form>
                        <form action={declineResponse}>
                          <input type="hidden" name="responseId" value={response.id} />
                          <button type="submit" className={secondaryButton}>
                            Decline
                          </button>
                        </form>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            {accepted.length > 0 ? (
              <p className="mt-4 text-sm font-medium text-hen">
                Confirmed with {accepted.map((response) => profileName(response.profiles)).join(", ")}.
              </p>
            ) : null}
            {pending.length === 0 && ride.status === "open" ? (
              <p className="mt-3 text-sm text-muted">New responses will show up here.</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {mine ? (
        <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">Your response</h2>
          <p className="mt-2 text-muted">
            {mine.status === "pending"
              ? "Waiting for the poster to accept or decline."
              : mine.status === "accepted"
                ? "You are confirmed for this trip. It is also listed in My Trips."
                : "This response was declined."}
          </p>
          <p className="mt-2 text-sm">
            {mine.seats} {mine.seats === 1 ? "seat" : "seats"}
            {mine.message ? ` · ${mine.message}` : ""}
          </p>
          {mine.status === "pending" ? (
            <form action={withdrawResponse} className="mt-4">
              <input type="hidden" name="rideId" value={ride.id} />
              <input type="hidden" name="responseId" value={mine.id} />
              <button type="submit" className={secondaryButton}>
                Withdraw
              </button>
            </form>
          ) : null}
        </section>
      ) : null}

      {canRespond ? (
        <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">
            {ride.kind === "offer" ? "Request a seat" : "Offer to drive"}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {ride.kind === "offer"
              ? "Tell the driver how many seats you need."
              : "Tell the student you can take them."}
          </p>
          <form action={createResponse} className="mt-4 space-y-4">
            <input type="hidden" name="rideId" value={ride.id} />
            <input type="hidden" name="kind" value={ride.kind} />
            <label className={labelClass}>
              {ride.kind === "offer" ? "Seats you need" : "Passengers you can take"}
              <span className={hintClass}>Required</span>
              <select className={fieldClass} name="seats" defaultValue={1}>
                {Array.from({ length: ride.seats }, (_, index) => index + 1).map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Message
              <span className={hintClass}>Optional</span>
              <textarea
                className={fieldClass}
                name="message"
                maxLength={300}
                rows={3}
                placeholder="Optional note about pickup or luggage."
              />
            </label>
            <button type="submit" className={primaryButton}>
              {ride.kind === "offer" ? "Request seat" : "Offer this ride"}
            </button>
          </form>
        </section>
      ) : null}

      {!isOwner && !mine && !canRespond ? (
        <p className="mt-6 rounded-2xl border border-line bg-white p-5 text-sm leading-6 text-muted shadow-sm">
          {ride.status === "cancelled"
            ? "This ride was cancelled."
            : "This ride is no longer taking new responses."}
        </p>
      ) : null}
    </div>
  );
}
