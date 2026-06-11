import { theme } from "@/lib/theme";
import type { RankingEntry } from "@/lib/types";

interface RankingListProps {
  ranking: RankingEntry[];
  currentUserId: string;
}

function getMedal(rank: number): string | null {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

export function RankingList({ ranking, currentUserId }: RankingListProps) {
  return (
    <ul className="space-y-2 sm:space-y-0">
      {/* Mobile: card list */}
      <div className="space-y-2 sm:hidden">
        {ranking.map((entry) => {
          const isCurrentUser = entry.user_id === currentUserId;
          const medal = getMedal(entry.rank);

          return (
            <li
              key={entry.user_id}
              className={`flex items-center gap-3 rounded-2xl border border-stone-800 bg-stone-900 p-3.5 ${
                isCurrentUser ? "ring-1 ring-lime-500/40" : ""
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center text-lg font-bold text-stone-500">
                {medal ?? entry.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate font-semibold ${
                    isCurrentUser ? "text-lime-400" : "text-amber-100"
                  }`}
                >
                  {entry.name}
                  {isCurrentUser && (
                    <span className="ml-1 text-xs font-normal text-stone-400">
                      (você)
                    </span>
                  )}
                </p>
              </div>
              <span className="shrink-0 rounded-xl bg-lime-950/60 px-3 py-1.5 text-lg font-black text-lime-400 ring-1 ring-lime-800/50">
                {entry.total_points}
              </span>
            </li>
          );
        })}
      </div>

      {/* Tablet+: table */}
      <div className={`hidden overflow-hidden sm:block ${theme.card}`}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-800 bg-neutral-900/90">
              <th className="px-4 py-3 font-bold text-lime-400">#</th>
              <th className="px-4 py-3 font-bold text-lime-400">Jogador</th>
              <th className="px-4 py-3 text-right font-bold text-lime-400">
                Pontos
              </th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((entry) => {
              const isCurrentUser = entry.user_id === currentUserId;
              const medal = getMedal(entry.rank);

              return (
                <tr
                  key={entry.user_id}
                  className={`border-b border-stone-800/60 last:border-0 ${
                    isCurrentUser ? "bg-lime-950/20" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-stone-500">
                    {medal ?? entry.rank}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        isCurrentUser ? "text-lime-400" : "text-amber-100"
                      }`}
                    >
                      {entry.name}
                      {isCurrentUser && (
                        <span className="ml-1 text-xs font-normal text-stone-400">
                          (você)
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex min-w-[3rem] justify-end rounded-lg bg-lime-950/60 px-2 py-0.5 font-black text-lime-400 ring-1 ring-lime-800/50">
                      {entry.total_points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ul>
  );
}
