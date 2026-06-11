export function LoadingSpinner({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
