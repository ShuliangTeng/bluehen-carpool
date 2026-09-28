import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center shadow-sm">
      <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-paper text-hen">
        {icon}
      </span>
      <p className="mt-4 text-lg font-semibold tracking-tight text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{children}</p>
      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}
