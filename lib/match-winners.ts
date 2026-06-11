import { supabase } from "./supabase";
import type { MatchWinner } from "./types";

type UserInfo = { name: string | null; pix_key: string | null };

function resolveUserInfo(
  users: UserInfo | UserInfo[] | null | undefined
): UserInfo | null {
  if (!users) return null;
  return Array.isArray(users) ? (users[0] ?? null) : users;
}

export async function getMatchWinnersMap(
  matchIds: string[]
): Promise<Map<string, MatchWinner[]>> {
  const result = new Map<string, MatchWinner[]>();
  if (matchIds.length === 0) return result;

  const { data: predictions } = await supabase
    .from("predictions")
    .select("match_id, user_id, points, users(name, pix_key)")
    .in("match_id", matchIds)
    .not("points", "is", null);

  const byMatch = new Map<
    string,
    { user_id: string; points: number | null; user: UserInfo | null }[]
  >();

  for (const row of predictions ?? []) {
    const list = byMatch.get(row.match_id) ?? [];
    list.push({
      user_id: row.user_id,
      points: row.points,
      user: resolveUserInfo(
        row.users as UserInfo | UserInfo[] | null | undefined
      ),
    });
    byMatch.set(row.match_id, list);
  }

  for (const [matchId, rows] of byMatch) {
    const maxPoints = Math.max(...rows.map((r) => r.points ?? 0));
    const winners = rows
      .filter((r) => (r.points ?? 0) === maxPoints && maxPoints > 0)
      .map((r) => ({
        user_id: r.user_id,
        name: r.user?.name?.trim() || "Jogador",
        pix_key: r.user?.pix_key?.trim() || null,
        points: r.points ?? 0,
      }));

    if (winners.length > 0) {
      result.set(matchId, winners);
    }
  }

  return result;
}
