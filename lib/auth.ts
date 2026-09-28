import { cache } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type Viewer = {
  id: string;
  fullName: string;
};

export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();

  return {
    id: userId,
    fullName: profile?.full_name ?? "UD student",
  };
});

export const getUnreadCount = cache(async () => {
  const viewer = await getViewer();
  if (!viewer) {
    return 0;
  }

  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", viewer.id)
    .is("read_at", null);

  return count ?? 0;
});

export async function requireViewer() {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/login");
  }
  return viewer;
}

export async function getRequestOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  if (!host) {
    return "http://localhost:3000";
  }
  return `${proto}://${host}`;
}
