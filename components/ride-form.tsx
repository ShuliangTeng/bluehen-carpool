"use client";

import { useActionState, useState } from "react";
import { CarIcon, SeatIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { fieldClass, helperClass, labelClass } from "@/components/styles";
import type { ActionState, RideKind } from "@/lib/types";

type RideFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  today: string;
  initial?: {
    rideId?: string;
    kind: RideKind;
    origin: string;
    destination: string;
    tripDate: string;
    departureTime: string;
    seats: number;
    price: string;
    notes: string;
    vehicle: string;
    hasLicense: boolean;
    hasInsurance: boolean;
  };
};

const empty = {
  kind: "offer" as RideKind,
  origin: "",
  destination: "",
  tripDate: "",
  departureTime: "",
  seats: "1",
  price: "",
  notes: "",
  vehicle: "",
  hasLicense: false,
  hasInsurance: false,
};

export function RideForm({ action, submitLabel, today, initial }: RideFormProps) {
  const [state, formAction] = useActionState(action, { error: null });
  const [draft, setDraft] = useState({
    ...empty,
    ...initial,
    seats: String(initial?.seats ?? empty.seats),
  });
  const offer = draft.kind === "offer";

  function update(
    name: "origin" | "destination" | "tripDate" | "departureTime" | "seats" | "price" | "notes" | "vehicle",
    value: string,
  ) {
    setDraft((current) => ({ ...current, [name]: value }));
  }

  return (
    <form action={formAction} className="space-y-5">
      {initial?.rideId ? <input type="hidden" name="rideId" value={initial.rideId} /> : null}
      <input type="hidden" name="kind" value={draft.kind} />
      {state.error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      <fieldset>
        <legend className={labelClass}>What are you posting?</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setDraft((current) => ({ ...current, kind: "offer" }))}
            className={`rounded-2xl border-2 p-4 text-left transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen ${
              offer ? "border-gold bg-gold/10" : "border-line bg-white hover:border-gold/70"
            }`}
            aria-pressed={offer}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold/30 text-hen-dark">
              <CarIcon />
            </span>
            <span className="mt-3 block text-base font-semibold tracking-tight">Offer a ride</span>
            <span className="mt-1 block text-sm font-normal leading-5 text-muted">
              I&apos;m driving and have available seats.
            </span>
          </button>
          <button
            type="button"
            onClick={() => setDraft((current) => ({ ...current, kind: "request" }))}
            className={`rounded-2xl border-2 p-4 text-left transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen ${
              !offer ? "border-hen bg-hen/5" : "border-line bg-white hover:border-hen/30"
            }`}
            aria-pressed={!offer}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-hen/10 text-hen">
              <SeatIcon />
            </span>
            <span className="mt-3 block text-base font-semibold tracking-tight">Request a ride</span>
            <span className="mt-1 block text-sm font-normal leading-5 text-muted">
              I need a ride to a destination.
            </span>
          </button>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Starting point
          <span className={helperClass}>Where the trip begins.</span>
          <input
            className={fieldClass}
            name="origin"
            required
            maxLength={80}
            value={draft.origin}
            onChange={(event) => update("origin", event.target.value)}
            placeholder="Newark, UD campus"
          />
        </label>
        <label className={labelClass}>
          Destination
          <span className={helperClass}>Where you are headed.</span>
          <input
            className={fieldClass}
            name="destination"
            required
            maxLength={80}
            value={draft.destination}
            onChange={(event) => update("destination", event.target.value)}
            placeholder="New York City"
          />
        </label>
        <label className={labelClass}>
          Date
          <span className={helperClass}>The day of the trip.</span>
          <input
            className={fieldClass}
            type="date"
            name="tripDate"
            required
            min={today}
            value={draft.tripDate}
            onChange={(event) => update("tripDate", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          {offer ? "Departure time" : "Preferred time"}
          <span className={helperClass}>
            {offer ? "When you plan to leave." : "About when you would like to leave."}
          </span>
          <input
            className={fieldClass}
            type="time"
            name="departureTime"
            required
            value={draft.departureTime}
            onChange={(event) => update("departureTime", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          {offer ? "Available seats" : "Number of passengers"}
          <span className={helperClass}>
            {offer ? "Seats you can offer, from 1 to 8." : "People who need a seat, from 1 to 8."}
          </span>
          <input
            className={fieldClass}
            type="number"
            name="seats"
            required
            min={1}
            max={8}
            value={draft.seats}
            onChange={(event) => update("seats", event.target.value)}
          />
        </label>
        <label className={labelClass}>
          {offer ? "Price per seat" : "Budget, optional"}
          <span className={helperClass}>
            {offer
              ? "What each passenger pays, from $0 to $500."
              : "What you are willing to contribute. Leave this blank if you do not have a number."}
          </span>
          <input
            className={fieldClass}
            type="number"
            name="price"
            required={offer}
            min={0}
            max={500}
            step="0.01"
            value={draft.price}
            onChange={(event) => update("price", event.target.value)}
            placeholder={offer ? "25" : "20"}
          />
        </label>
      </div>

      <label className={labelClass}>
        Notes
        <span className={helperClass}>Pickup spot, luggage, or anything else helpful.</span>
        <textarea
          className={fieldClass}
          name="notes"
          maxLength={500}
          rows={3}
          value={draft.notes}
          onChange={(event) => update("notes", event.target.value)}
          placeholder="Meet at the Trabant garage."
        />
      </label>

      {offer ? (
        <div className="space-y-4 rounded-2xl border border-gold/50 bg-gold/10 p-4">
          <label className={labelClass}>
            Vehicle
            <span className={helperClass}>A short description so riders know the car.</span>
            <input
              className={fieldClass}
              name="vehicle"
              required
              maxLength={80}
              value={draft.vehicle}
              onChange={(event) => update("vehicle", event.target.value)}
              placeholder="Blue Honda Civic"
            />
          </label>
          <label className="flex min-h-11 items-start gap-3 text-sm font-medium">
            <input
              type="checkbox"
              name="hasLicense"
              checked={draft.hasLicense}
              onChange={(event) =>
                setDraft((current) => ({ ...current, hasLicense: event.target.checked }))
              }
              required
              className="mt-1"
            />
            I have a valid driver&apos;s license.
          </label>
          <label className="flex min-h-11 items-start gap-3 text-sm font-medium">
            <input
              type="checkbox"
              name="hasInsurance"
              checked={draft.hasInsurance}
              onChange={(event) =>
                setDraft((current) => ({ ...current, hasInsurance: event.target.checked }))
              }
              required
              className="mt-1"
            />
            I have auto insurance.
          </label>
          <p className="text-sm leading-6 text-muted">
            BlueHen CarPool does not check licenses or insurance. Confirm those details with each
            other before you ride.
          </p>
        </div>
      ) : null}

      <SubmitButton
        label={initial?.rideId ? submitLabel : offer ? "Post offer" : "Post request"}
        pendingLabel="Saving..."
      />
    </form>
  );
}
