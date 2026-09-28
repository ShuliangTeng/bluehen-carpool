import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateRide } from "@/app/actions/rides";
import { RideForm } from "@/components/ride-form";
import { requireViewer } from "@/lib/auth";
import { todayInNewark } from "@/lib/format";
import { normalizeRide } from "@/lib/rides";
import { createClient } from "@/lib/supabase/server";
import type { RideRecord } from "@/lib/types";

export const metadata: Metadata = {
  title: "Edit ride",
};

export default async function EditRidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await requireViewer();
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("rides")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const ride = normalizeRide(data as RideRecord);
  if (ride.user_id !== viewer.id) {
    redirect(`/rides/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href={`/rides/${id}`} className="text-sm font-semibold text-hen">
        Back to this ride
      </Link>
      <h1 className="mt-3 text-3xl font-bold">Edit your ride</h1>
      {ride.status !== "open" ? (
        <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-muted">
          Only open rides can be edited. This one is {ride.status}.
        </p>
      ) : (
        <div className="mt-6 rounded-3xl border border-line bg-white p-5 sm:p-6">
          <RideForm
            action={updateRide}
            submitLabel="Save changes"
            today={todayInNewark()}
            initial={{
              rideId: ride.id,
              kind: ride.kind,
              origin: ride.origin,
              destination: ride.destination,
              tripDate: ride.trip_date,
              departureTime: ride.departure_time.slice(0, 5),
              seats: ride.seats,
              price: ride.price === null ? "" : String(ride.price),
              notes: ride.notes,
              vehicle: ride.vehicle ?? "",
              hasLicense: ride.has_license,
              hasInsurance: ride.has_insurance,
            }}
          />
        </div>
      )}
    </div>
  );
}
