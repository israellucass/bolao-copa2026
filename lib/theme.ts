/** Grupo Grileiros — Rustic-Modern Earthy theme tokens (mobile-first) */

export const APP_TITLE = "Bolão Grileiros 2026";
export const APP_TITLE_SHORT = "Grileiros 2026";
export const APP_SUBTITLE = "Grupo Grileiros · Seleção Brasileira";
export const CRICKET_ICON = "🦗";
export const MASCOT_IMAGE = "/grileiros-mascot.png";

export const theme = {
  shell: "flex min-h-dvh flex-col bg-stone-950",
  page: "min-h-dvh bg-stone-950 text-amber-100 safe-x safe-bottom",
  main:
    "mx-auto w-full max-w-lg flex-1 px-4 py-4 pb-6 sm:py-5",
  mainWithNav:
    "mx-auto w-full max-w-lg flex-1 px-4 py-4 pb-2 sm:py-5",
  heading: "text-xl font-black text-amber-100 sm:text-2xl",
  subheading: "text-sm leading-relaxed text-stone-400",
  sectionTitle:
    "text-xs font-bold uppercase tracking-wider text-lime-400/90 sm:text-sm",
  sectionTitleMuted:
    "text-xs font-bold uppercase tracking-wider text-stone-500 sm:text-sm",
  card: "overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-lg",
  cardInner:
    "rounded-2xl border border-stone-800 bg-stone-900 p-4 shadow-lg sm:p-5",
  cardHeader:
    "border-b border-stone-800 bg-neutral-900/90 px-4 py-3.5 sm:px-5",
  label:
    "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-400",
  labelInline: "mb-1.5 block text-xs font-medium text-stone-400",
  input:
    "w-full min-h-12 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-base text-amber-100 placeholder:text-stone-600 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-500/40 sm:text-sm",
  select:
    "w-full min-h-12 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-base text-amber-100 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-500/40 sm:text-sm",
  scoreInput:
    "h-14 w-[4.5rem] rounded-xl border border-stone-700 bg-stone-950 px-1 py-2 text-center text-2xl font-bold text-lime-400 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-500 disabled:cursor-not-allowed disabled:border-stone-800 disabled:bg-stone-900 disabled:text-stone-600 sm:h-12 sm:w-16 sm:text-xl",
  btnPrimary:
    "inline-flex min-h-12 min-w-[3rem] items-center justify-center rounded-xl bg-lime-400 px-4 py-3 text-base font-bold text-stone-950 transition-colors active:scale-[0.98] hover:bg-lime-300 disabled:opacity-60 sm:text-sm",
  btnPrimaryFull:
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-lime-400 py-3.5 text-base font-bold text-stone-950 transition-colors active:scale-[0.98] hover:bg-lime-300 disabled:opacity-60 sm:text-sm",
  btnGhost:
    "inline-flex min-h-10 min-w-[2.5rem] items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-amber-100/90 transition active:bg-stone-800 hover:bg-stone-800 hover:text-amber-100",
  btnChip:
    "inline-flex min-h-10 items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition active:scale-[0.98] sm:text-sm",
  alertWarning:
    "rounded-xl border border-amber-900/60 bg-amber-950/50 px-3 py-3 text-center text-sm leading-snug text-amber-300",
  alertError:
    "rounded-xl border border-red-900/60 bg-red-950/50 px-3 py-3 text-center text-sm leading-snug text-red-300",
  alertSuccess:
    "rounded-xl border border-lime-900/50 bg-lime-950/30 px-3 py-3 text-center text-sm leading-snug text-lime-400",
  emptyState:
    "rounded-2xl border border-dashed border-stone-700 bg-stone-900/40 px-4 py-10 text-center sm:py-12",
  link: "inline-flex min-h-10 items-center text-lime-400 active:text-lime-300 hover:text-lime-300 hover:underline",
  points: "font-black text-lime-400",
  accentText: "font-semibold text-lime-400",
  divider: "border-stone-800",
} as const;
