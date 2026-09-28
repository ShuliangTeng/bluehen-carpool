"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function markNotificationRead(formData: FormData) {
  const viewer = await requireViewer();
  const id = String(formData.get("id") ?? "");
  const rideId = String(formData.get("rideId") ?? "");
  const supabase = await createClient();

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", viewer.id)
    .is("read_at", null);

  revalidatePath("/notifications");
  revalidatePath("/", "layout");

  if (rideId) {
    redirect(`/rides/${rideId}`);
  }
  redirect("/notifications");
}

export async function markAllNotificationsRead() {
  const viewer = await requireViewer();
  const supabase = await createClient();

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", viewer.id)
    .is("read_at", null);

  revalidatePath("/notifications");
  revalidatePath("/", "layout");
}
