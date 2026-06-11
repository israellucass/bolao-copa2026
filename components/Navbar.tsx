import Link from "next/link";
import { GrileirosMascot } from "@/components/GrileirosMascot";
import { logout } from "@/lib/actions/auth";
import { APP_SUBTITLE, APP_TITLE, APP_TITLE_SHORT, theme } from "@/lib/theme";
import type { User } from "@/lib/types";

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/95 shadow-lg shadow-black/20 backdrop-blur-md safe-top safe-x"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3 py-3">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5">
          <GrileirosMascot variant="nav" priority className="shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight tracking-wide text-amber-100 sm:text-base">
              <span className="sm:hidden">{APP_TITLE_SHORT}</span>
              <span className="hidden sm:inline">{APP_TITLE}</span>
            </p>
            <p className="truncate text-[10px] font-medium text-stone-400 sm:text-xs">
              {APP_SUBTITLE}
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <div className="rounded-full bg-stone-900 px-3 py-1.5 text-right ring-1 ring-stone-800">
            <p className="text-[10px] text-stone-500">Olá,</p>
            <p className="max-w-[5rem] truncate text-xs font-semibold text-lime-400 sm:max-w-none sm:text-sm">
              {user.name ?? "Jogador"}
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className={`${theme.btnGhost} min-h-9 px-2.5 text-xs text-stone-400 hover:text-amber-100`}
              aria-label="Sair da conta"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
