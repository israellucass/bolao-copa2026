import { AppShell } from "@/components/AppShell";
import { GrileirosMascot } from "@/components/GrileirosMascot";
import { MatchCard } from "@/components/MatchCard";
import { getMatchesForUser } from "@/lib/actions/matches";
import { requireCompleteUser } from "@/lib/auth";
import { theme } from "@/lib/theme";

export default async function DashboardPage() {
  const user = await requireCompleteUser();

  const matches = await getMatchesForUser();

  const upcoming = matches.filter((m) => m.status !== "finished");
  const past = matches.filter((m) => m.status === "finished");

  const sortedUpcoming = [...upcoming].sort(
    (a, b) =>
      new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
  );
  const sortedPast = [...past].sort(
    (a, b) =>
      new Date(b.match_date).getTime() - new Date(a.match_date).getTime()
  );

  return (
    <AppShell user={user}>
      <main className={theme.mainWithNav}>
        <header className="mb-5 text-center sm:text-left">
          <GrileirosMascot
            variant="hero"
            className="mx-auto mb-3 sm:mx-0 drop-shadow-[0_6px_20px_rgba(0,0,0,0.4)]"
          />
          <h1 className={theme.heading}>Jogos do Brasil</h1>
          <p className={theme.subheading}>
            Palpites na próxima partida, antes do apito inicial. O Pix ao
            vencedor é feito depois do resultado.
          </p>
        </header>

        {matches.length === 0 ? (
          <div className={theme.emptyState}>
            <p className="text-3xl" aria-hidden>
              🦗
            </p>
            <p className="mt-2 font-semibold text-amber-100">
              Nenhuma partida cadastrada
            </p>
            <p className={`mt-1 ${theme.subheading}`}>
              O admin adicionará os jogos da Seleção em breve.
            </p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {sortedUpcoming.length > 0 && (
              <section className="space-y-3 sm:space-y-4">
                <h2 className={theme.sectionTitle}>Próximas partidas</h2>
                {sortedUpcoming.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </section>
            )}

            {sortedPast.length > 0 && (
              <section className="space-y-3 sm:space-y-4">
                <h2 className={theme.sectionTitleMuted}>Partidas anteriores</h2>
                {sortedPast.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </section>
            )}
          </div>
        )}
      </main>
    </AppShell>
  );
}
