import { supabase } from "./supabase";
import type { Match, MatchPrizeSettlement } from "./types";

type UserInfo = { name: string | null; pix_key: string | null };

type PredictionRow = {
  match_id: string;
  user_id: string;
  points: number | null;
  users: UserInfo | UserInfo[] | null;
};

function resolveUserInfo(
  users: UserInfo | UserInfo[] | null | undefined
): UserInfo | null {
  if (!users) return null;
  return Array.isArray(users) ? (users[0] ?? null) : users;
}

export function computeSettlement(
  matchPot: number,
  carryIn: number,
  participants: {
    user_id: string;
    name: string;
    pix_key: string | null;
    points: number;
  }[]
): { settlement: MatchPrizeSettlement | null; nextCarry: number } {
  if (participants.length === 0) {
    return { settlement: null, nextCarry: carryIn };
  }

  const totalPot = carryIn + matchPot;
  const maxPoints = Math.max(...participants.map((p) => p.points));
  const winners =
    maxPoints > 0
      ? participants.filter((p) => p.points === maxPoints)
      : [];

  if (winners.length === 0) {
    return { settlement: null, nextCarry: totalPot };
  }

  const winnerIds = new Set(winners.map((w) => w.user_id));
  const losers = participants.filter((p) => !winnerIds.has(p.user_id));
  const prizePerWinner = totalPot / winners.length;
  const amountDuePerLoser =
    losers.length > 0 ? totalPot / losers.length : 0;
  const amountPerWinnerFromLoser =
    losers.length > 0 ? amountDuePerLoser / winners.length : 0;

  return {
    settlement: {
      match_pot: matchPot,
      carry_in: carryIn,
      total_pot: totalPot,
      participant_count: participants.length,
      winner_count: winners.length,
      prize_per_winner: prizePerWinner,
      winners: winners.map((w) => ({
        user_id: w.user_id,
        name: w.name,
        pix_key: w.pix_key,
        points: w.points,
        prize_amount: prizePerWinner,
      })),
      losers: losers.map((l) => ({
        user_id: l.user_id,
        name: l.name,
        amount_due: amountDuePerLoser,
        payments: winners.map((w) => ({
          winner_id: w.user_id,
          winner_name: w.name,
          amount: amountPerWinnerFromLoser,
        })),
      })),
    },
    nextCarry: 0,
  };
}

export async function getMatchPrizeSettlementsMap(
  finishedMatches: Pick<Match, "id" | "cost_brl" | "match_date">[]
): Promise<Map<string, MatchPrizeSettlement>> {
  const result = new Map<string, MatchPrizeSettlement>();
  if (finishedMatches.length === 0) return result;

  const sorted = [...finishedMatches].sort(
    (a, b) =>
      new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
  );
  const matchIds = sorted.map((m) => m.id);

  const { data: predictions } = await supabase
    .from("predictions")
    .select("match_id, user_id, points, users(name, pix_key)")
    .in("match_id", matchIds)
    .not("points", "is", null);

  const byMatch = new Map<string, PredictionRow[]>();
  for (const row of (predictions ?? []) as PredictionRow[]) {
    const list = byMatch.get(row.match_id) ?? [];
    list.push(row);
    byMatch.set(row.match_id, list);
  }

  let carryIn = 0;

  for (const match of sorted) {
    const rows = byMatch.get(match.id) ?? [];
    const participants = rows.map((r) => {
      const user = resolveUserInfo(r.users);
      return {
        user_id: r.user_id,
        name: user?.name?.trim() || "Jogador",
        pix_key: user?.pix_key?.trim() || null,
        points: r.points ?? 0,
      };
    });

    const matchPot = participants.length * match.cost_brl;
    const { settlement, nextCarry } = computeSettlement(
      matchPot,
      carryIn,
      participants
    );

    carryIn = nextCarry;

    if (settlement) {
      result.set(match.id, settlement);
    }
  }

  return result;
}
