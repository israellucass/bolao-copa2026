import Image from "next/image";
import { cn } from "@/lib/cn";

const MASCOT_SRC = "/grileiros-mascot.png";

type GrileirosMascotVariant = "nav" | "hero";

const variantStyles: Record<GrileirosMascotVariant, string> = {
  nav: "h-10 w-auto max-w-[4.5rem] object-contain object-left sm:h-11 sm:max-w-[5rem]",
  hero: "h-28 w-auto max-w-[min(100%,16rem)] object-contain sm:h-32 sm:max-w-xs",
};

interface GrileirosMascotProps {
  variant?: GrileirosMascotVariant;
  priority?: boolean;
  className?: string;
}

export function GrileirosMascot({
  variant = "nav",
  priority = false,
  className,
}: GrileirosMascotProps) {
  return (
    <Image
      src={MASCOT_SRC}
      alt="Grileiro — mascote do Bolão Grileiros"
      width={1024}
      height={558}
      priority={priority}
      className={cn(variantStyles[variant], className)}
    />
  );
}
