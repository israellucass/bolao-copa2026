import Image from "next/image";
import { formatTeamName } from "@/lib/format";
import { getTeamFlagUrl } from "@/lib/team-flags";
import { cn } from "@/lib/cn";

const sizeStyles = {
  sm: {
    flag: 20,
    text: "text-sm leading-snug",
    gap: "gap-2",
  },
  md: {
    flag: 24,
    text: "text-base leading-snug",
    gap: "gap-2.5",
  },
  lg: {
    flag: 28,
    text: "text-lg leading-snug sm:text-xl",
    gap: "gap-3",
  },
} as const;

interface TeamLabelProps {
  name: string;
  size?: keyof typeof sizeStyles;
  layout?: "inline" | "stacked";
  className?: string;
  flagClassName?: string;
}

export function TeamLabel({
  name,
  size = "md",
  layout = "inline",
  className,
  flagClassName,
}: TeamLabelProps) {
  const styles = sizeStyles[size];
  const flagUrl = getTeamFlagUrl(name, styles.flag);
  const displayName = formatTeamName(name);

  const flag = flagUrl ? (
    <Image
      src={flagUrl}
      alt=""
      width={styles.flag}
      height={Math.round(styles.flag * 0.75)}
      unoptimized
      className={cn(
        "shrink-0 rounded-sm object-cover shadow-sm ring-1 ring-stone-700/80",
        flagClassName
      )}
      aria-hidden
    />
  ) : (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm bg-stone-800 text-[10px] text-stone-500 ring-1 ring-stone-700",
        flagClassName
      )}
      style={{ width: styles.flag, height: Math.round(styles.flag * 0.75) }}
      aria-hidden
    >
      ?
    </span>
  );

  if (layout === "stacked") {
    return (
      <span
        className={cn(
          "flex min-w-0 flex-col items-center gap-1.5 text-center font-semibold text-amber-50",
          styles.text,
          className
        )}
      >
        {flag}
        <span className="max-w-full leading-snug">{displayName}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center font-semibold text-amber-50",
        styles.gap,
        styles.text,
        className
      )}
    >
      {flag}
      <span className="truncate">{displayName}</span>
    </span>
  );
}
