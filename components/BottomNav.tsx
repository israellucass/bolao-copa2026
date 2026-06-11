"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CRICKET_ICON } from "@/lib/theme";
import type { User } from "@/lib/types";

interface BottomNavProps {
  user: User;
}

const items = [
  { href: "/", label: "Jogos", icon: "⚽" },
  { href: "/ranking", label: "Ranking", icon: CRICKET_ICON },
  { href: "/perfil", label: "Perfil", icon: "👤" },
] as const;

export function BottomNav({ user }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = user.is_admin
    ? [...items, { href: "/admin", label: "Admin", icon: "⚙️" as const }]
    : items;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-800 bg-stone-950/95 shadow-[0_-8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md safe-x"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.5rem)",
      }}
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around gap-1 pt-2">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[3.25rem] min-w-[4rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold transition active:scale-95 sm:text-xs ${
                active
                  ? "bg-lime-400/15 text-lime-400"
                  : "text-stone-400 hover:text-amber-100"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span className="text-lg leading-none" aria-hidden>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
