import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { getRanking } from "@/lib/actions/ranking";
import { requireCompleteUser } from "@/lib/auth";

export default async function RankingPage() {
  const user = await requireCompleteUser();

  const ranking = await getRanking();

  return (
    <>
      <Navbar user={user} />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5">
        <section className="mb-5">
          <h1 className="text-xl font-black text-emerald-950">Ranking</h1>
          <p className="text-sm text-gray-500">
            Classificação geral do bolão — {ranking.length} jogadores
          </p>
        </section>

        {ranking.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-12 text-center">
            <p className="text-3xl" aria-hidden>
              🏆
            </p>
            <p className="mt-2 font-semibold text-emerald-900">
              Ranking vazio
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Os pontos aparecerão após as partidas serem finalizadas.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-yellow-50">
                  <th className="px-4 py-3 font-bold text-emerald-900">#</th>
                  <th className="px-4 py-3 font-bold text-emerald-900">
                    Jogador
                  </th>
                  <th className="px-4 py-3 text-right font-bold text-emerald-900">
                    Pontos
                  </th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((entry) => {
                  const isCurrentUser = entry.user_id === user.id;
                  const medal =
                    entry.rank === 1
                      ? "🥇"
                      : entry.rank === 2
                        ? "🥈"
                        : entry.rank === 3
                          ? "🥉"
                          : null;

                  return (
                    <tr
                      key={entry.user_id}
                      className={`border-b border-gray-50 last:border-0 ${
                        isCurrentUser ? "bg-yellow-50/80" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-bold text-gray-500">
                        {medal ?? entry.rank}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            isCurrentUser
                              ? "text-emerald-800"
                              : "text-gray-900"
                          }`}
                        >
                          {entry.name}
                          {isCurrentUser && (
                            <span className="ml-1 text-xs font-normal text-emerald-600">
                              (você)
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex min-w-[3rem] justify-end rounded-lg bg-emerald-100 px-2 py-0.5 font-black text-emerald-800">
                          {entry.total_points}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-gray-400">
          <Link href="/" className="text-emerald-600 hover:underline">
            ← Voltar aos jogos
          </Link>
        </p>
      </main>
    </>
  );
}
