import { TeamLabel } from "@/components/TeamLabel";
import { cn } from "@/lib/cn";

interface MatchTeamsProps {
  homeTeam: string;
  awayTeam: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MatchTeams({
  homeTeam,
  awayTeam,
  size = "lg",
  className,
}: MatchTeamsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1",
        className
      )}
    >
      <TeamLabel name={homeTeam} size={size} className="font-bold" />
      <span
        className={cn(
          "px-0.5 font-medium text-stone-500",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        vs
      </span>
      <TeamLabel name={awayTeam} size={size} className="font-bold" />
    </div>
  );
}
