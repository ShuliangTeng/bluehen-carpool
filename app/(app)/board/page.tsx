import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { CarIcon } from "@/components/icons";
import { PostChoices } from "@/components/post-choices";
import { RideCard } from "@/components/ride-card";
import {
  alertError,
  fieldClass,
  filterActive,
  filterIdle,
  pageLead,
  pageTitle,
  primaryButton,
  secondaryButton,
} from "@/components/styles";
import { createClient } from "@/lib/supabase/server";
import { flashMessage, oneParam, todayInNewark } from "@/lib/format";
import { normalizeRide } from "@/lib/rides";
import type { RideRecord } from "@/lib/types";

function boardHref(kind: string, q: string) {
  const params = new URLSearchParams();
  if (kind) {
    params.set("kind", kind);
  }
  if (q) {
    params.set("q", q);
  }
  const query = params.toString();
  return query ? `/board?${query}` : "/board";
}

export const metadata: Metadata = {
  title: "Ride board",
};

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const kind = oneParam(params.kind) ?? "";
  const q = (oneParam(params.q) ?? "").trim().slice(0, 80);
  const error = flashMessage(oneParam(params.error), "error");
  const supabase = await createClient();

  let query = supabase
    .from("rides")
    .select("*, profiles(full_name)")
    .eq("status", "open")
    .gte("trip_date", todayInNewark())
    .gt("seats", 0)
    .order("trip_date", { ascending: true })
    .order("departure_time", { ascending: true });

  if (kind === "offer" || kind === "request") {
    query = query.eq("kind", kind);
  }
  if (q) {
    query = query.ilike("destination", `%${q}%`);
  }

  const { data } = await query;
  const rides = ((data ?? []) as RideRecord[]).map(normalizeRide);
  const filtering = kind !== "" || q !== "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div>
        <h1 className={pageTitle}>Ride board</h1>
        <p className={pageLead}>
          Open rides from UD students. Offers are drivers with seats. Requests are students who need a ride.
        </p>
      </div>
      <div className="mt-6">
        <PostChoices />
      </div>

      {error ? (
        <p role="alert" className={`mt-4 ${alertError}`}>
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Ride type">
        {(
          [
            ["", "All"],
            ["offer", "Offers"],
            ["request", "Requests"],
          ] as const
        ).map(([value, label]) => {
          const active = kind === value;
          return (
            <Link
              key={label}
              href={boardHref(value, q)}
              className={active ? filterActive : filterIdle}
              aria-current={active ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <form method="get" className="mt-4 grid gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto]">
        {kind === "offer" || kind === "request" ? (
          <input type="hidden" name="kind" value={kind} />
        ) : null}
        <label className="text-sm font-semibold">
          Destination
          <input
            className={fieldClass}
            name="q"
            defaultValue={q}
            placeholder="New York City"
            maxLength={80}
          />
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <button type="submit" className={primaryButton}>
            Search
          </button>
          {filtering ? (
            <Link href="/board" className={secondaryButton}>
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      {rides.length === 0 ? (
        <EmptyState
          icon={<CarIcon />}
          title={
            q
              ? "No rides match that search."
              : kind === "offer"
                ? "No open offers right now."
                : kind === "request"
                  ? "No open requests right now."
                  : "No rides yet"
          }
          action={
            <>
              <Link href="/rides/new?kind=offer" className={secondaryButton}>
                Offer a ride
              </Link>
              <Link href="/rides/new?kind=request" className={secondaryButton}>
                Request a ride
              </Link>
            </>
          }
        >
          {q
            ? "Try another destination, or post your own trip."
            : kind === "offer"
              ? "Offer a ride if you are driving and have seats."
              : kind === "request"
                ? "Request a ride if you need to get somewhere."
                : "Offer seats if you are driving, or request a ride if you need one."}
        </EmptyState>
      ) : (
        <div className="mt-6 grid gap-4">
          {rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </div>
      )}
    </div>
  );
}
