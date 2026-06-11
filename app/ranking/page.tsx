import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { RankingList } from "@/components/RankingList";
import { getRanking } from "@/lib/actions/ranking";
import { requireCompleteUser } from "@/lib/auth";
import { CRICKET_ICON, theme } from "@/lib/theme";

export default async function RankingPage() {
  const user = await requireCompleteUser();

  const ranking = await getRanking();

  return (
    <AppShell user={user}>
      <main className={theme.mainWithNav}>
        <section className="mb-5">
          <h1 className={`${theme.heading} flex items-center gap-2`}>
            <span aria-hidden>{CRICKET_ICON}</span>
            Ranking
          </h1>
          <p className={theme.subheading}>
            Classificação geral do bolão — {ranking.length} jogadores
          </p>
        </section>

        {ranking.length === 0 ? (
          <div className={theme.emptyState}>
            <p className="text-3xl" aria-hidden>
              {CRICKET_ICON}
            </p>
            <p className="mt-2 font-semibold text-amber-100">Ranking vazio</p>
            <p className={`mt-1 ${theme.subheading}`}>
              Os pontos aparecerão após as partidas serem finalizadas.
            </p>
          </div>
        ) : (
          <RankingList ranking={ranking} currentUserId={user.id} />
        )}

        <p className="mt-5 text-center">
          <Link href="/" className={theme.link}>
            ← Voltar aos jogos
          </Link>
        </p>
      </main>
    </AppShell>
  );
}
