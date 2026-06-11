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
  className?: string;
  flagClassName?: string;
}

export function TeamLabel({
  name,
  size = "md",
  className,
  flagClassName,
}: TeamLabelProps) {
  const styles = sizeStyles[size];
  const flagUrl = getTeamFlagUrl(name, styles.flag === 20 ? 20 : styles.flag === 24 ? 24 : 32);
  const displayName = formatTeamName(name);

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center font-semibold text-amber-50",
        styles.gap,
        styles.text,
        className
      )}
    >
      {flagUrl ? (
        <Image
          src={flagUrl}
          alt=""
          width={styles.flag}
          height={Math.round(styles.flag * 0.75)}
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
      )}
      <span className="truncate">{displayName}</span>
    </span>
  );
}
