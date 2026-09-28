import type { Metadata } from "next";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/app/actions/notifications";
import { secondaryButton } from "@/components/styles";
import { requireViewer } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Notifications",
};

type NotificationRow = {
  id: string;
  message: string;
  ride_id: string | null;
  read_at: string | null;
  created_at: string;
};

export default async function NotificationsPage() {
  const viewer = await requireViewer();
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, message, ride_id, read_at, created_at")
    .eq("user_id", viewer.id)
    .order("created_at", { ascending: false });

  const notes = (data ?? []) as NotificationRow[];
  const unread = notes.some((note) => note.read_at === null);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="mt-2 leading-7 text-muted">
            Responses and decisions about your rides show up here.
          </p>
        </div>
        {unread ? (
          <form action={markAllNotificationsRead}>
            <button type="submit" className={secondaryButton}>
              Mark all read
            </button>
          </form>
        ) : null}
      </div>

      {notes.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold">You&apos;re all caught up</p>
          <p className="mt-2 leading-6 text-muted">
            When someone responds to a ride, or a response is accepted, it will show up here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {notes.map((note) => {
            const unreadNote = note.read_at === null;
            return (
              <li key={note.id}>
                <form action={markNotificationRead}>
                  <input type="hidden" name="id" value={note.id} />
                  <input type="hidden" name="rideId" value={note.ride_id ?? ""} />
                  <button
                    type="submit"
                    className={`flex w-full items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition duration-150 hover:border-hen/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen ${
                      unreadNote ? "border-gold" : "border-line"
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        unreadNote ? "bg-gold" : "bg-line"
                      }`}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block font-medium leading-6 text-ink">{note.message}</span>
                      <span className="mt-1 block text-sm text-muted">
                        {formatDate(note.created_at.slice(0, 10))}
                        {note.ride_id ? " · Open ride" : ""}
                      </span>
                    </span>
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
