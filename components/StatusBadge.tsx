const variants = {
  open: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  closed: "bg-amber-100 text-amber-800 ring-amber-200",
  finished: "bg-slate-200 text-slate-700 ring-slate-300",
  paid: "bg-green-100 text-green-800 ring-green-200",
  pending: "bg-orange-100 text-orange-800 ring-orange-200",
} as const;

const labels = {
  open: "Aberta",
  closed: "Fechada",
  finished: "Finalizada",
  paid: "Pago",
  pending: "Pendente",
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
