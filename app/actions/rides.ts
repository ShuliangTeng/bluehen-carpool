"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireViewer } from "@/lib/auth";
import { parseRideForm, toRideRow } from "@/lib/rides";
import type { ActionState, RideKind } from "@/lib/types";

function refreshRide(id: string) {
  revalidatePath("/board");
  revalidatePath("/trips");
  revalidatePath(`/rides/${id}`);
  revalidatePath(`/rides/${id}/edit`);
}

export async function createRide(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const viewer = await requireViewer();
  const parsed = parseRideForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rides")
    .insert(toRideRow(parsed.value, viewer.id))
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Could not post that ride. Please check the details and try again." };
  }

  refreshRide(data.id);
  redirect(`/rides/${data.id}`);
}

export async function updateRide(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const viewer = await requireViewer();
  const rideId = String(formData.get("rideId") ?? "");
  const parsed = parseRideForm(formData);
  if (!rideId) {
    return { error: "We could not find that ride." };
  }
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("rides")
    .select("id, user_id, status")
    .eq("id", rideId)
    .maybeSingle();

  if (!existing || existing.user_id !== viewer.id) {
    return { error: "You can only edit your own rides." };
  }
  if (existing.status !== "open") {
    return { error: "Only open rides can be edited." };
  }

  const { error } = await supabase
    .from("rides")
    .update(toRideRow(parsed.value, viewer.id))
    .eq("id", rideId)
    .eq("user_id", viewer.id);

  if (error) {
    return { error: "Could not save those changes. Please try again." };
  }

  refreshRide(rideId);
  redirect(`/rides/${rideId}?notice=saved`);
}

export async function cancelRide(formData: FormData) {
  const viewer = await requireViewer();
  const rideId = String(formData.get("rideId") ?? "");
  const supabase = await createClient();
  const { data: ride } = await supabase
    .from("rides")
    .select("id, user_id, status")
    .eq("id", rideId)
    .maybeSingle();

  if (!ride || ride.user_id !== viewer.id) {
    redirect("/trips?error=forbidden");
  }
  if (ride.status !== "cancelled") {
    const { error } = await supabase
      .from("rides")
      .update({ status: "cancelled" })
      .eq("id", rideId)
      .eq("user_id", viewer.id);
    if (error) {
      redirect(`/rides/${rideId}?error=invalid`);
    }
  }

  refreshRide(rideId);
  redirect(`/rides/${rideId}?notice=cancelled`);
}

export async function deleteRide(formData: FormData) {
  const viewer = await requireViewer();
  const rideId = String(formData.get("rideId") ?? "");
  const supabase = await createClient();
  const { error } = await supabase
    .from("rides")
    .delete()
    .eq("id", rideId)
    .eq("user_id", viewer.id);

  if (error) {
    redirect(`/rides/${rideId}?error=invalid`);
  }

  revalidatePath("/board");
  revalidatePath("/trips");
  redirect("/trips");
}

export async function createResponse(formData: FormData) {
  const viewer = await requireViewer();
  const rideId = String(formData.get("rideId") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  const seats = Number(formData.get("seats"));
  const kind = String(formData.get("kind") ?? "") as RideKind;

  if (!Number.isInteger(seats) || seats < 1 || seats > 8 || message.length > 300) {
    redirect(`/rides/${rideId}?error=invalid`);
  }

  const supabase = await createClient();
  const { data: ride } = await supabase
    .from("rides")
    .select("id, user_id, status, seats, kind")
    .eq("id", rideId)
    .maybeSingle();

  if (!ride) {
    redirect("/board?error=missing");
  }
  if (ride.user_id === viewer.id) {
    redirect(`/rides/${rideId}?error=own`);
  }
  if (ride.status !== "open" || seats > ride.seats) {
    redirect(`/rides/${rideId}?error=${seats > ride.seats ? "full" : "closed"}`);
  }

  const { error } = await supabase.from("ride_responses").insert({
    ride_id: rideId,
    user_id: viewer.id,
    seats,
    message,
  });

  if (error) {
    const duplicate = error.code === "23505";
    redirect(`/rides/${rideId}?error=${duplicate ? "duplicate" : "invalid"}`);
  }

  refreshRide(rideId);
  redirect(`/rides/${rideId}?notice=${kind === "request" ? "offered" : "requested"}`);
}

export async function withdrawResponse(formData: FormData) {
  const viewer = await requireViewer();
  const rideId = String(formData.get("rideId") ?? "");
  const responseId = String(formData.get("responseId") ?? "");
  const supabase = await createClient();
  const { error } = await supabase
    .from("ride_responses")
    .delete()
    .eq("id", responseId)
    .eq("user_id", viewer.id)
    .eq("status", "pending");

  if (error) {
    redirect(`/rides/${rideId}?error=unavailable`);
  }

  refreshRide(rideId);
  redirect(`/rides/${rideId}?notice=withdrawn`);
}

export async function acceptResponse(formData: FormData) {
  const viewer = await requireViewer();
  const responseId = String(formData.get("responseId") ?? "");
  const supabase = await createClient();

  const { data: response } = await supabase
    .from("ride_responses")
    .select("id, ride_id, seats, status, user_id")
    .eq("id", responseId)
    .maybeSingle();

  if (!response || response.status !== "pending") {
    redirect("/trips?error=unavailable");
  }

  const { data: ride } = await supabase
    .from("rides")
    .select("id, user_id, kind, seats, status")
    .eq("id", response.ride_id)
    .maybeSingle();

  if (!ride || ride.user_id !== viewer.id) {
    redirect("/trips?error=forbidden");
  }
  if (ride.status !== "open") {
    redirect(`/rides/${ride.id}?error=closed`);
  }
  if (ride.kind === "offer" && response.seats > ride.seats) {
    redirect(`/rides/${ride.id}?error=full`);
  }

  const { data: accepted, error: acceptError } = await supabase
    .from("ride_responses")
    .update({ status: "accepted" })
    .eq("id", responseId)
    .eq("status", "pending")
    .select("id");

  if (acceptError || !accepted?.length) {
    redirect(`/rides/${ride.id}?error=unavailable`);
  }

  if (ride.kind === "offer") {
    const remaining = ride.seats - response.seats;
    const { error: rideError } = await supabase
      .from("rides")
      .update({
        seats: remaining,
        status: remaining === 0 ? "full" : "open",
      })
      .eq("id", ride.id)
      .eq("user_id", viewer.id);

    if (rideError) {
      await supabase
        .from("ride_responses")
        .update({ status: "pending" })
        .eq("id", responseId);
      redirect(`/rides/${ride.id}?error=invalid`);
    }

    if (remaining === 0) {
      await supabase
        .from("ride_responses")
        .update({ status: "declined" })
        .eq("ride_id", ride.id)
        .eq("status", "pending");
    }
  } else {
    const { error: rideError } = await supabase
      .from("rides")
      .update({ status: "confirmed" })
      .eq("id", ride.id)
      .eq("user_id", viewer.id);

    if (rideError) {
      await supabase
        .from("ride_responses")
        .update({ status: "pending" })
        .eq("id", responseId);
      redirect(`/rides/${ride.id}?error=invalid`);
    }

    await supabase
      .from("ride_responses")
      .update({ status: "declined" })
      .eq("ride_id", ride.id)
      .eq("status", "pending")
      .neq("id", responseId);
  }

  refreshRide(ride.id);
  redirect(`/rides/${ride.id}?notice=accepted`);
}

export async function declineResponse(formData: FormData) {
  const viewer = await requireViewer();
  const responseId = String(formData.get("responseId") ?? "");
  const supabase = await createClient();
  const { data: response } = await supabase
    .from("ride_responses")
    .select("id, ride_id, status")
    .eq("id", responseId)
    .maybeSingle();

  if (!response) {
    redirect("/trips?error=unavailable");
  }

  const { data: ride } = await supabase
    .from("rides")
    .select("user_id")
    .eq("id", response.ride_id)
    .maybeSingle();

  if (!ride || ride.user_id !== viewer.id) {
    redirect("/trips?error=forbidden");
  }

  const { error } = await supabase
    .from("ride_responses")
    .update({ status: "declined" })
    .eq("id", responseId)
    .eq("status", "pending");

  if (error) {
    redirect(`/rides/${response.ride_id}?error=unavailable`);
  }

  refreshRide(response.ride_id);
  redirect(`/rides/${response.ride_id}?notice=declined`);
}
