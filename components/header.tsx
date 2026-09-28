import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/actions/auth";
import { BellIcon, CarIcon } from "@/components/icons";
import { RideNav } from "@/components/ride-nav";
import { navButton, primaryButton } from "@/components/styles";
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
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2.5 rounded-xl text-hen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-hen text-gold">
            <CarIcon className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[1.05rem] font-semibold leading-none tracking-tight">
            BlueHen <span className="font-medium text-ink">CarPool</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2" aria-label="Main">
          {viewer ? (
            <>
              <Link href="/board" className={navButton}>
                Ride board
              </Link>
              <Suspense
                fallback={
                  <>
                    <Link href="/rides/new?kind=offer" className={navButton}>
                      Offer
                    </Link>
                    <Link href="/rides/new?kind=request" className={navButton}>
                      Request
                    </Link>
                  </>
                }
              >
                <RideNav />
              </Suspense>
              <Link href="/trips" className={navButton}>
                My trips
              </Link>
              <Link
                href="/notifications"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-hen transition duration-150 hover:border-hen/40 hover:bg-paper active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen"
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
              <span className="max-w-28 truncate px-1 text-sm font-medium text-muted sm:max-w-40">
                {viewer.fullName}
              </span>
              <form action={signOut}>
                <button type="submit" className={navButton}>
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={navButton}>
                Log in
              </Link>
              <Link href="/signup" className={primaryButton}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
