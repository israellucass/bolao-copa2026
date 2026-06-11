import { DEFAULT_BET_BRL } from "@/lib/constants";
import { theme } from "@/lib/theme";

interface CurrencyInputProps {
  name: string;
  label?: string;
  defaultValue?: string;
  min?: string;
  step?: string;
  required?: boolean;
  id?: string;
}

export function CurrencyInput({
  name,
  label,
  defaultValue = DEFAULT_BET_BRL.toFixed(2),
  min = "1",
  step = "0.01",
  required,
  id,
}: CurrencyInputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={theme.labelInline}>
          {label}
        </label>
      )}
      <div className="relative">
        <span
          className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center rounded-l-xl border-r border-stone-700 bg-stone-900/80 text-sm font-bold text-lime-400"
          aria-hidden
        >
          R$
        </span>
        <input
          id={id}
          name={name}
          type="number"
          step={step}
          min={min}
          defaultValue={defaultValue}
          required={required}
          inputMode="decimal"
          className={`${theme.input} pl-14 tabular-nums`}
        />
      </div>
    </div>
  );
}
