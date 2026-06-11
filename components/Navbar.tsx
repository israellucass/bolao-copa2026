import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import type { User } from "@/lib/types";

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/20 bg-gradient-to-r from-emerald-950 via-green-900 to-yellow-700 text-white shadow-lg">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            ⚽
          </span>
          <div>
            <p className="text-sm font-bold leading-tight tracking-wide">
              Bolão Copa 2026
            </p>
            <p className="text-[10px] font-medium text-yellow-200/90">
              Seleção Brasileira
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/perfil"
            className="rounded-lg px-2.5 py-1.5 font-medium text-yellow-100 transition hover:bg-white/10"
          >
            Perfil
          </Link>
          <Link
            href="/ranking"
            className="rounded-lg px-2.5 py-1.5 font-medium text-yellow-100 transition hover:bg-white/10"
          >
            Ranking
          </Link>
          {user.is_admin && (
            <Link
              href="/admin"
              className="rounded-lg px-2.5 py-1.5 font-medium text-yellow-100 transition hover:bg-white/10"
            >
              Admin
            </Link>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Sair
            </button>
          </form>
        </nav>
      </div>
      <div className="border-t border-white/10 bg-black/20 px-4 py-1.5 text-center text-xs text-yellow-100/90">
        Olá,{" "}
        <span className="font-semibold text-white">
          {user.name ?? "Jogador"}
        </span>
      </div>
    </header>
  );
}
