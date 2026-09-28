const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen";

const motion = "transition duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

export const primaryButton = `inline-flex min-h-11 items-center justify-center rounded-xl bg-hen px-5 text-sm font-semibold tracking-tight text-white shadow-sm hover:bg-hen-dark ${motion} ${focus}`;

export const secondaryButton = `inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-sm font-semibold tracking-tight text-ink shadow-sm hover:border-hen/40 hover:bg-paper ${motion} ${focus}`;

export const navButton = `inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-white px-3.5 text-sm font-semibold tracking-tight text-ink hover:border-hen/30 hover:bg-paper ${motion} ${focus}`;

export const navButtonActive = `inline-flex min-h-11 items-center justify-center rounded-xl bg-hen px-3.5 text-sm font-semibold tracking-tight text-white shadow-sm hover:bg-hen-dark ${motion} ${focus}`;

export const filterIdle = `inline-flex min-h-11 items-center rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink transition duration-150 hover:border-hen/30 hover:bg-paper ${focus}`;

export const filterActive = `inline-flex min-h-11 items-center rounded-xl bg-hen px-4 text-sm font-semibold text-white shadow-sm ${focus}`;

export const pageTitle = "text-3xl font-semibold tracking-tight text-ink";

export const pageLead = "mt-2 max-w-2xl text-base leading-7 text-muted";

export const alertError =
  "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800";

export const alertOk =
  "rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-900";

export const linkCard =
  "block rounded-2xl border border-line bg-white p-5 shadow-sm transition duration-150 hover:border-hen/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen active:translate-y-px";

export const routeTitle = "break-words text-2xl font-semibold tracking-tight text-ink";

export const textLink =
  "rounded-sm text-sm font-semibold text-hen hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen";

export const dangerButton = `inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-5 text-sm font-semibold text-red-700 hover:bg-red-50 ${motion} ${focus}`;

export const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-3 text-base leading-6 text-ink outline-none transition duration-150 placeholder:text-muted/70 focus:border-hen focus:ring-2 focus:ring-hen/20";

export const labelClass = "block text-sm font-semibold tracking-tight text-ink";

export const hintClass = "ml-1.5 text-xs font-medium text-muted";

export const helperClass = "mt-1.5 block text-sm font-normal leading-5 text-muted";

export const cardClass =
  "rounded-2xl border border-line bg-white p-5 shadow-sm";

export const chipClass =
  "inline-flex items-center gap-1.5 rounded-xl bg-paper px-2.5 py-1 text-sm font-medium leading-5 text-ink";

export const kindPill =
  "inline-flex items-center gap-1 rounded-xl border border-line bg-paper px-2.5 py-1 text-xs font-semibold tracking-wide text-ink";

export const choiceCard =
  "rounded-2xl border border-line bg-white p-4 text-left text-ink transition duration-150 hover:border-hen/30 hover:bg-paper active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen";

export const choiceCardSelected =
  "rounded-2xl border-2 border-hen bg-hen p-4 text-left text-white shadow-sm transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen";
