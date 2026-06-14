import type { MatchPrizeSettlement } from "./types";

export function userIsWinner(
  settlement: MatchPrizeSettlement | null | undefined,
  userId: string
): boolean {
  return settlement?.winners.some((w) => w.user_id === userId) ?? false;
}

export function userIsLoser(
  settlement: MatchPrizeSettlement | null | undefined,
  userId: string
): boolean {
  return settlement?.losers.some((l) => l.user_id === userId) ?? false;
}

export function userLoserEntry(
  settlement: MatchPrizeSettlement | null | undefined,
  userId: string
) {
  return settlement?.losers.find((l) => l.user_id === userId) ?? null;
}
