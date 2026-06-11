import type { MatchStatus } from "./database.types";
import { calculatePredictionPoints } from "./scoring";
import { supabase } from "./supabase";

const FINISHED_STATUSES = new Set(["FT", "AET", "PEN", "FINISHED"]);
const LIVE_STATUSES = new Set([
  "1H",
  "2H",
  "HT",
  "ET",
  "BT",
  "P",
  "LIVE",
  "INT",
  "IN_PLAY",
  "PAUSED",
]);
const SKIP_STATUSES = new Set([
  "CANC",
  "ABD",
  "AWD",
  "WO",
  "PST",
  "CANCELLED",
]);

export function mapApiStatusToMatch(statusShort: string): {
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
} | null {
  if (SKIP_STATUSES.has(statusShort)) return null;

  if (FINISHED_STATUSES.has(statusShort)) {
    return { status: "finished", homeScore: null, awayScore: null };
  }
  if (LIVE_STATUSES.has(statusShort)) {
    return { status: "closed", homeScore: null, awayScore: null };
  }
  return { status: "open", homeScore: null, awayScore: null };
}

export async function createPaymentsForAllUsers(matchId: string): Promise<void> {
  const { data: users } = await supabase.from("users").select("id");
  if (!users?.length) return;

  await supabase.from("payments").insert(
    users.map((u) => ({
      user_id: u.id,
      match_id: matchId,
      paid: false,
    }))
  );
}

export async function recalculateMatchPoints(
  matchId: string,
  homeScore: number,
  awayScore: number
): Promise<void> {
  const { data: predictions } = await supabase
    .from("predictions")
    .select("id, home_score, away_score")
    .eq("match_id", matchId);

  await Promise.all(
    (predictions ?? []).map((pred) => {
      const points = calculatePredictionPoints(
        pred.home_score,
        pred.away_score,
        homeScore,
        awayScore
      );
      return supabase
        .from("predictions")
        .update({ points, updated_at: new Date().toISOString() })
        .eq("id", pred.id);
    })
  );
}
