import type { Metadata } from "next";
import Link from "next/link";
import { RideCard } from "@/components/ride-card";
import { requireViewer } from "@/lib/auth";
import {
  flashMessage,
  formatDate,
  formatTime,
  oneParam,
  priceLabel,
  profileName,
  statusLabel,
} from "@/lib/format";
import { nestedRide, normalizeRide } from "@/lib/rides";
import { createClient } from "@/lib/supabase/server";
import type { ResponseRecord, RideRecord } from "@/lib/types";

export const metadata: Metadata = {
  title: "My trips",
};

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const viewer = await requireViewer();
  const params = await searchParams;
  const error = flashMessage(oneParam(params.error), "error");
  const supabase = await createClient();

  const [postedResult, responseResult] = await Promise.all([
    supabase
      .from("rides")
      .select("*, profiles(full_name)")
      .eq("user_id", viewer.id)
      .order("trip_date", { ascending: true }),
    supabase
      .from("ride_responses")
      .select("*, profiles(full_name), rides(*, profiles(full_name))")
      .order("created_at", { ascending: false }),
  ]);

  const posted = ((postedResult.data ?? []) as RideRecord[]).map(normalizeRide);
  const responses = (responseResult.data ?? []) as ResponseRecord[];
  const sent = responses.filter((response) => response.user_id === viewer.id);
  const confirmed = responses.filter((response) => {
    const ride = nestedRide(response.rides);
    return response.status === "accepted" && ride && ride.status !== "cancelled";
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">My trips</h1>
      <p className="mt-2 text-muted">
        Rides you posted, responses you sent, and trips that are confirmed.
      </p>
      {error ? (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <section className="mt-8">
        <h2 className="text-2xl font-bold">Confirmed trips</h2>
        {confirmed.length === 0 ? (
          <p className="mt-3 text-muted">
            Nothing confirmed yet. When a request is accepted, it will show up here.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4">
            {confirmed.map((response) => {
              const ride = nestedRide(response.rides);
              if (!ride) {
                return null;
              }
              const otherName =
                response.user_id === viewer.id
                  ? profileName(ride.profiles)
                  : profileName(response.profiles);
              return (
                <li key={response.id}>
                  <Link
                    href={`/rides/${ride.id}`}
                    className="block rounded-2xl border border-line bg-white p-5 shadow-sm transition duration-150 hover:border-hen/40 hover:shadow-md"
                  >
                    <p className="text-sm font-semibold text-hen">Confirmed with {otherName}</p>
                    <p className="mt-2 text-xl font-semibold tracking-tight">
                      {ride.origin} <span className="text-hen">→</span> {ride.destination}
                    </p>
                    <p className="mt-2 text-ink">
                      {formatDate(ride.trip_date)} at {formatTime(ride.departure_time)}
                    </p>
                    <p className="mt-1 text-muted">
                      {response.seats} {response.seats === 1 ? "seat" : "seats"} ·{" "}
                      {priceLabel(ride.kind, ride.price)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Rides I posted</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/rides/new?kind=offer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gold bg-gold/20 px-4 text-sm font-semibold text-hen-dark"
            >
              Offer
            </Link>
            <Link
              href="/rides/new?kind=request"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-hen/30 bg-white px-4 text-sm font-semibold text-hen"
            >
              Request
            </Link>
          </div>
        </div>
        {posted.length === 0 ? (
          <p className="mt-3 text-muted">You have not posted a ride yet.</p>
        ) : (
          <div className="mt-4 grid gap-4">
            {posted.map((ride) => (
              <RideCard key={ride.id} ride={ride} showStatus />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Responses I sent</h2>
        {sent.length === 0 ? (
          <p className="mt-3 text-muted">
            When you request a seat or offer to drive, it will show up here.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4">
            {sent.map((response) => {
              const ride = nestedRide(response.rides);
              if (!ride) {
                return null;
              }
              return (
                <li key={response.id}>
                  <Link
                    href={`/rides/${ride.id}`}
                    className="block rounded-2xl border border-line bg-white p-5 shadow-sm transition duration-150 hover:border-hen/40 hover:shadow-md"
                  >
                    <p className="text-sm font-semibold text-muted">
                      {statusLabel(response.status)} · {response.seats}{" "}
                      {response.seats === 1 ? "seat" : "seats"}
                    </p>
                    <p className="mt-2 text-xl font-semibold tracking-tight">
                      {ride.origin} <span className="text-hen">→</span> {ride.destination}
                    </p>
                    <p className="mt-2 text-ink">
                      {formatDate(ride.trip_date)} at {formatTime(ride.departure_time)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
