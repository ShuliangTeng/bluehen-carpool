import type { Metadata } from "next";
import { PostChoices } from "@/components/post-choices";
import { RideForm } from "@/components/ride-form";
import { pageLead, pageTitle } from "@/components/styles";
import { createRide } from "@/app/actions/rides";
import { oneParam, todayInNewark } from "@/lib/format";
import type { RideKind } from "@/lib/types";

export const metadata: Metadata = {
  title: "Offer or request",
};

export default async function NewRidePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const kind = oneParam(params.kind);
  const selected: RideKind | null = kind === "offer" || kind === "request" ? kind : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className={pageTitle}>
        {selected === "offer"
          ? "Offer a ride"
          : selected === "request"
            ? "Request a ride"
            : "Offer or request"}
      </h1>
      <p className={pageLead}>
        {selected === "offer"
          ? "You are driving and have seats available."
          : selected === "request"
            ? "You need a ride to a destination."
            : "Choose whether you are driving or looking for a ride."}
      </p>

      {selected ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <RideForm
            key={selected}
            action={createRide}
            submitLabel={selected === "offer" ? "Post offer" : "Post request"}
            showKindPicker={false}
            today={todayInNewark()}
            initial={{
              kind: selected,
              origin: "",
              destination: "",
              tripDate: "",
              departureTime: "",
              seats: 1,
              price: "",
              notes: "",
              vehicle: "",
              hasLicense: false,
              hasInsurance: false,
            }}
          />
        </div>
      ) : (
        <div className="mt-6">
          <PostChoices />
        </div>
      )}
    </div>
  );
}
