import type { Match } from "./types";

type MatchScores = Pick<Match, "home_score" | "away_score">;
type MatchScoreStatus = Pick<Match, "status" | "home_score" | "away_score">;

export function matchHasFinalScore(match: MatchScores): boolean {
  return match.home_score != null && match.away_score != null;
}

/** Finalizada pelo admin ou API, mas sem placar lançado. */
export function matchScorePending(match: MatchScoreStatus): boolean {
  return match.status === "finished" && !matchHasFinalScore(match);
}

export function matchNeedsScoreEntry(match: MatchScoreStatus): boolean {
  return match.status !== "finished" || matchScorePending(match);
}
