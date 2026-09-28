import type { ProfileJoin, RideKind, RideStatus } from "@/lib/types";

export function profileName(profiles: ProfileJoin) {
  if (!profiles) {
    return "UD student";
  }
  if (Array.isArray(profiles)) {
    return profiles[0]?.full_name ?? "UD student";
  }
  return profiles.full_name;
}

export function formatDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function formatTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatPrice(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

export function priceLabel(kind: RideKind, price: number | string | null | undefined) {
  if (price === null || price === undefined || price === "") {
    return kind === "request" ? "No budget set" : "Price not set";
  }
  const amount = Number(price);
  if (Number.isNaN(amount)) {
    return kind === "request" ? "No budget set" : "Price not set";
  }
  const formatted = formatPrice(amount);
  return kind === "request" ? `${formatted} budget` : `${formatted} per seat`;
}

export function todayInNewark() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(new Date());
}

export function kindLabel(kind: RideKind) {
  return kind === "offer" ? "Offer" : "Request";
}

export function statusLabel(status: RideStatus | string) {
  switch (status) {
    case "open":
      return "Open";
    case "full":
      return "Full";
    case "confirmed":
      return "Confirmed";
    case "cancelled":
      return "Cancelled";
    case "pending":
      return "Waiting";
    case "accepted":
      return "Confirmed";
    case "declined":
      return "Declined";
    default:
      return status;
  }
}

export function seatLabel(kind: RideKind, seats: number) {
  if (kind === "offer") {
    return seats === 1 ? "1 seat left" : `${seats} seats left`;
  }
  return seats === 1 ? "1 passenger" : `${seats} passengers`;
}

export function oneParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

const notices: Record<string, string> = {
  requested: "Seat request sent. The driver can accept or decline it.",
  offered: "Your offer was sent. The student can accept or decline it.",
  accepted: "Accepted. This trip now shows under My Trips as confirmed.",
  declined: "Request declined.",
  withdrawn: "You withdrew your request.",
  cancelled: "This ride was cancelled and removed from the board.",
  saved: "Your ride was updated.",
};

const errors: Record<string, string> = {
  closed: "This ride is no longer open.",
  full: "There are not enough seats left.",
  own: "You cannot respond to your own ride.",
  duplicate: "You already responded to this ride.",
  invalid: "Please check the details and try again.",
  unavailable: "That request is no longer pending.",
  missing: "We could not find that ride.",
  forbidden: "You can only change your own rides.",
};

export function flashMessage(code: string | undefined, kind: "notice" | "error") {
  if (!code) {
    return null;
  }
  return kind === "notice" ? notices[code] ?? null : errors[code] ?? null;
}
