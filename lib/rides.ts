import type { RideInput, RideKind, RideRecord, ResponseRecord } from "@/lib/types";
import { todayInNewark } from "@/lib/format";

export type ParseResult =
  | { ok: false; error: string }
  | { ok: true; value: RideInput };

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export function parseRideForm(formData: FormData): ParseResult {
  const kindValue = field(formData, "kind");
  if (kindValue !== "offer" && kindValue !== "request") {
    return { ok: false, error: "Choose whether you are offering a ride or looking for one." };
  }
  const kind: RideKind = kindValue;
  const origin = field(formData, "origin");
  const destination = field(formData, "destination");
  const tripDate = field(formData, "tripDate");
  const departureTime = field(formData, "departureTime");
  const seatsValue = field(formData, "seats");
  const priceValue = field(formData, "price");
  const notes = field(formData, "notes");
  const vehicle = field(formData, "vehicle");
  const hasLicense = formData.get("hasLicense") === "on";
  const hasInsurance = formData.get("hasInsurance") === "on";

  if (origin.length < 2 || origin.length > 80) {
    return { ok: false, error: "Enter a starting point (2–80 characters)." };
  }
  if (destination.length < 2 || destination.length > 80) {
    return { ok: false, error: "Enter a destination (2–80 characters)." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tripDate) || tripDate < todayInNewark()) {
    return { ok: false, error: "Choose today or a future date." };
  }
  if (!/^\d{2}:\d{2}$/.test(departureTime)) {
    return { ok: false, error: "Choose a departure time." };
  }

  const seats = Number(seatsValue);
  if (!Number.isInteger(seats) || seats < 1 || seats > 8) {
    return { ok: false, error: "Enter a number of seats or passengers from 1 to 8." };
  }
  let price: number | null = null;
  if (kind === "offer" || priceValue !== "") {
    if (!/^\d+(\.\d{1,2})?$/.test(priceValue)) {
      return {
        ok: false,
        error:
          kind === "offer"
            ? "Enter a price per seat, like 25 or 12.50."
            : "Enter a budget in dollars, like 20, or leave it blank.",
      };
    }
    price = Number(priceValue);
    if (price < 0 || price > 500) {
      return { ok: false, error: "Use an amount between $0 and $500." };
    }
  }
  if (notes.length > 500) {
    return { ok: false, error: "Notes should be 500 characters or fewer." };
  }

  if (kind === "offer") {
    if (vehicle.length < 2 || vehicle.length > 80) {
      return { ok: false, error: "Add a short description of your vehicle." };
    }
    if (!hasLicense || !hasInsurance) {
      return {
        ok: false,
        error: "Offers need a checked driver's license and auto insurance.",
      };
    }
  }

  return {
    ok: true,
    value: {
      kind,
      origin,
      destination,
      tripDate,
      departureTime,
      seats,
      price,
      notes,
      vehicle: kind === "offer" ? vehicle : null,
      hasLicense: kind === "offer" ? hasLicense : false,
      hasInsurance: kind === "offer" ? hasInsurance : false,
    },
  };
}

export function normalizeRide(row: RideRecord): RideRecord {
  return {
    ...row,
    price:
      row.price === null || row.price === undefined || row.price === ""
        ? null
        : Number(row.price),
    trip_date: String(row.trip_date).slice(0, 10),
    departure_time: String(row.departure_time),
  };
}

export function nestedRide(value: ResponseRecord["rides"]) {
  if (!value) {
    return null;
  }
  const row = Array.isArray(value) ? value[0] : value;
  return row ? normalizeRide(row) : null;
}

export function toRideRow(value: RideInput, userId: string) {
  return {
    user_id: userId,
    kind: value.kind,
    origin: value.origin,
    destination: value.destination,
    trip_date: value.tripDate,
    departure_time: value.departureTime,
    seats: value.seats,
    price: value.price,
    notes: value.notes,
    vehicle: value.vehicle,
    has_license: value.hasLicense,
    has_insurance: value.hasInsurance,
  };
}
