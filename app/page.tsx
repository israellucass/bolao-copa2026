import { MatchCard } from "@/components/MatchCard";
import { Navbar } from "@/components/Navbar";
import { getMatchesForUser } from "@/lib/actions/matches";
import { requireCompleteUser } from "@/lib/auth";

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
    <>
      <Navbar user={user} />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5">
        <section className="mb-6">
          <h1 className="text-xl font-black text-emerald-950">
            Jogos do Brasil
          </h1>
          <p className="text-sm text-gray-500">
            Palpites apenas na próxima partida, antes do apito inicial — com
            pagamento confirmado.
          </p>
        </section>

        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-12 text-center">
            <p className="text-3xl" aria-hidden>
              🏟️
            </p>
            <p className="mt-2 font-semibold text-emerald-900">
              Nenhuma partida cadastrada
            </p>
            <p className="mt-1 text-sm text-gray-500">
              O admin adicionará os jogos da Seleção em breve.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedUpcoming.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700">
                  Próximas partidas
                </h2>
                {sortedUpcoming.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </section>
            )}

            {sortedPast.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  Partidas anteriores
                </h2>
                {sortedPast.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
}
