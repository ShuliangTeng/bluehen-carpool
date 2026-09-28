import Link from "next/link";
import { CarIcon, SeatIcon } from "@/components/icons";
import { choiceCard, choiceCardSelected } from "@/components/styles";

const choices = [
  {
    kind: "offer" as const,
    href: "/rides/new?kind=offer",
    title: "Offer a ride",
    body: "I’m driving and have available seats.",
    Icon: CarIcon,
  },
  {
    kind: "request" as const,
    href: "/rides/new?kind=request",
    title: "Request a ride",
    body: "I need a ride to a destination.",
    Icon: SeatIcon,
  },
];

export function PostChoices({
  selected,
  linked = true,
}: {
  selected?: "offer" | "request";
  linked?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {choices.map(({ kind, href, title, body, Icon }) => {
        const active = selected === kind;
        const className = active
          ? choiceCardSelected
          : linked
            ? choiceCard
            : "rounded-2xl border border-line bg-white p-4 text-left text-ink";
        const iconClass = `inline-flex h-9 w-9 items-center justify-center rounded-xl ${
          active ? "bg-white/15 text-white" : "bg-paper text-hen"
        }`;
        const bodyClass = `mt-1 block text-sm leading-6 ${active ? "text-white/80" : "text-muted"}`;
        const content = (
          <>
            <span className={iconClass}>
              <Icon />
            </span>
            <span className="mt-3 block text-lg font-semibold tracking-tight">{title}</span>
            <span className={bodyClass}>{body}</span>
          </>
        );

        if (!linked) {
          return (
            <div key={kind} className={className}>
              {content}
            </div>
          );
        }

        return (
          <Link key={kind} href={href} className={className}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
