const variants = {
  open: "bg-lime-950/60 text-lime-400 ring-lime-800",
  closed: "bg-stone-800 text-stone-300 ring-stone-700",
  finished: "bg-neutral-800 text-stone-400 ring-stone-700",
  paid: "bg-emerald-950 text-emerald-300 ring-emerald-800",
  pending: "bg-amber-950 text-amber-300 ring-amber-900",
} as const;

const labels = {
  open: "Aberta",
  closed: "Fechada",
  finished: "Finalizada",
  paid: "Pix enviado",
  pending: "Pix pendente",
} as const;

type Variant = keyof typeof variants;

export function StatusBadge({ status }: { status: Variant }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${variants[status]}`}
    >
      {labels[status]}
    </span>
  );
}
