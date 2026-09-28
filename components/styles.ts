const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hen";

const motion = "transition duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

export const primaryButton = `inline-flex min-h-11 items-center justify-center rounded-xl bg-hen px-5 text-sm font-semibold tracking-tight text-white shadow-sm hover:bg-hen-dark ${motion} ${focus}`;

export const secondaryButton = `inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-sm font-semibold tracking-tight text-ink shadow-sm hover:border-hen/40 hover:bg-paper ${motion} ${focus}`;

export const goldButton = `inline-flex min-h-11 items-center justify-center rounded-xl bg-gold px-5 text-sm font-semibold tracking-tight text-hen-dark shadow-sm hover:brightness-95 ${motion} ${focus}`;

export const dangerButton = `inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-5 text-sm font-semibold text-red-700 hover:bg-red-50 ${motion} ${focus}`;

export const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-3 text-base leading-6 text-ink outline-none transition duration-150 placeholder:text-muted/70 focus:border-hen focus:ring-2 focus:ring-hen/20";

export const labelClass = "block text-sm font-semibold tracking-tight text-ink";

export const helperClass = "mt-1.5 block text-sm font-normal leading-5 text-muted";

export const cardClass =
  "rounded-2xl border border-line bg-white p-5 shadow-sm";

export const chipClass =
  "inline-flex items-center gap-1.5 rounded-xl bg-paper px-2.5 py-1 text-sm font-medium leading-5 text-ink";
