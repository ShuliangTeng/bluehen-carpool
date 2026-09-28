import type { Metadata } from "next";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/app/actions/notifications";
import { EmptyState } from "@/components/empty-state";
import { BellIcon } from "@/components/icons";
import { pageLead, pageTitle, secondaryButton } from "@/components/styles";
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
          <h1 className={pageTitle}>Notifications</h1>
          <p className={pageLead}>
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
        <EmptyState icon={<BellIcon />} title="No notifications">
          You&apos;re all caught up. When someone responds to a ride, or a response is accepted, it will show up here.
        </EmptyState>
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
                    className={`flex w-full items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition duration-150 hover:border-hen/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen active:translate-y-px ${
                      unreadNote ? "border-l-4 border-line border-l-hen" : "border-line"
                    }`}
                  >
                    <span
                      className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                        unreadNote ? "bg-hen" : "bg-line"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        {unreadNote ? (
                          <span className="rounded-xl bg-paper px-2 py-0.5 text-xs font-semibold text-hen">
                            Unread
                          </span>
                        ) : null}
                        <span className="text-sm text-muted">
                          {formatDate(note.created_at.slice(0, 10))}
                        </span>
                      </span>
                      <span
                        className={`mt-1 block break-words leading-6 ${
                          unreadNote ? "font-semibold text-ink" : "font-medium text-ink"
                        }`}
                      >
                        {note.message}
                      </span>
                      {note.ride_id ? (
                        <span className="mt-2 block text-sm font-semibold text-hen">Open ride</span>
                      ) : null}
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
