export function LoadingSpinner({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-stone-800 border-t-lime-400"
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-stone-400">{label}</p>
    </div>
  );
}
