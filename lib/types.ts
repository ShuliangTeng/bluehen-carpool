export type RideKind = "offer" | "request";
export type RideStatus = "open" | "full" | "confirmed" | "cancelled";
export type ResponseStatus = "pending" | "accepted" | "declined";

export type ActionState = {
  error: string | null;
  fullName?: string;
  email?: string;
  attempt?: number;
};

export type ProfileJoin =
  | { full_name: string }
  | { full_name: string }[]
  | null;

export type RideRecord = {
  id: string;
  user_id: string;
  kind: RideKind;
  origin: string;
  destination: string;
  trip_date: string;
  departure_time: string;
  seats: number;
  price: number | string | null;
  notes: string;
  vehicle: string | null;
  has_license: boolean;
  has_insurance: boolean;
  status: RideStatus;
  created_at: string;
  profiles: ProfileJoin;
};

export type ResponseRecord = {
  id: string;
  ride_id: string;
  user_id: string;
  seats: number;
  message: string;
  status: ResponseStatus;
  created_at: string;
  profiles: ProfileJoin;
  rides: RideRecord | RideRecord[] | null;
};

export type RideInput = {
  kind: RideKind;
  origin: string;
  destination: string;
  tripDate: string;
  departureTime: string;
  seats: number;
  price: number | null;
  notes: string;
  vehicle: string | null;
  hasLicense: boolean;
  hasInsurance: boolean;
};
