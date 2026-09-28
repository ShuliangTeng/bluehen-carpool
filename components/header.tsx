import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { BellIcon } from "@/components/icons";
import { goldButton, secondaryButton } from "@/components/styles";
import type { Viewer } from "@/lib/auth";

export function Header({
  viewer,
  unreadCount,
}: {
  viewer: Viewer | null;
  unreadCount: number;
}) {
  const badge = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-hen">
          BlueHen CarPool
        </Link>
        <nav className="flex flex-wrap items-center gap-2" aria-label="Main">
          {viewer ? (
            <>
              <Link href="/board" className={secondaryButton}>
                Ride board
              </Link>
              <Link
                href="/rides/new?kind=offer"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gold bg-gold/20 px-4 text-sm font-semibold tracking-tight text-hen-dark transition duration-150 hover:bg-gold/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen"
              >
                Offer
              </Link>
              <Link
                href="/rides/new?kind=request"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-hen/30 bg-white px-4 text-sm font-semibold tracking-tight text-hen transition duration-150 hover:bg-hen/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen"
              >
                Request
              </Link>
              <Link href="/trips" className={secondaryButton}>
                My trips
              </Link>
              <Link
                href="/notifications"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-hen transition duration-150 hover:border-hen/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen"
                aria-label={
                  unreadCount > 0
                    ? `${unreadCount} unread notifications`
                    : "Notifications"
                }
              >
                <BellIcon />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-hen-dark">
                    {badge}
                  </span>
                ) : null}
              </Link>
              <span className="px-1 text-sm font-medium text-muted">{viewer.fullName}</span>
              <form action={signOut}>
                <button type="submit" className={secondaryButton}>
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={secondaryButton}>
                Log in
              </Link>
              <Link href="/signup" className={goldButton}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="h-1 bg-gold" />
    </header>
  );
}
