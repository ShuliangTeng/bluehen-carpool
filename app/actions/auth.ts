"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRequestOrigin, getViewer } from "@/lib/auth";
import type { ActionState } from "@/lib/types";

function emailOf(formData: FormData) {
  return String(formData.get("email") ?? "").trim().toLowerCase();
}

export async function signUp(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = emailOf(formData);
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const kept = { fullName, email, attempt: Date.now() };

  if (fullName.length < 2 || fullName.length > 40) {
    return { error: "Please enter your name (2–40 characters).", ...kept };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address.", ...kept };
  }
  if (password.length < 8) {
    return { error: "Use a password with at least 8 characters.", ...kept };
  }
  if (password !== confirm) {
    return { error: "Those passwords do not match.", ...kept };
  }

  const supabase = await createClient();
  const origin = await getRequestOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return {
      error: "We could not create that account. Try a different email.",
      ...kept,
    };
  }

  if (data.session) {
    redirect("/board");
  }

  redirect("/signup/check-email");
}

export async function signIn(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = emailOf(formData);
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password.", email, attempt: Date.now() };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const message = error.message.toLowerCase();
    if (error.code === "email_not_confirmed" || message.includes("confirm")) {
      return {
        error:
          "Confirm your email first. Open the link we sent you, then log in with this password.",
        email,
        attempt: Date.now(),
      };
    }
    return {
      error: "That email and password did not match. Try again.",
      email,
      attempt: Date.now(),
    };
  }

  redirect("/board");
}

export async function signOut() {
  const viewer = await getViewer();
  if (!viewer) {
    redirect("/");
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
