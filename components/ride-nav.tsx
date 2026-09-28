"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { navButton, navButtonActive } from "@/components/styles";

export function RideNav() {
  const pathname = usePathname();
  const kind = useSearchParams().get("kind");
  const onNewRide = pathname === "/rides/new";
  const offer = onNewRide && kind === "offer";
  const request = onNewRide && kind === "request";

  return (
    <>
      <Link
        href="/rides/new?kind=offer"
        className={offer ? navButtonActive : navButton}
        aria-current={offer ? "page" : undefined}
      >
        Offer
      </Link>
      <Link
        href="/rides/new?kind=request"
        className={request ? navButtonActive : navButton}
        aria-current={request ? "page" : undefined}
      >
        Request
      </Link>
    </>
  );
}
