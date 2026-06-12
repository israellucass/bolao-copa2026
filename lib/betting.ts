import type { BetLockReason, Match, MatchWithMeta } from "./types";

type MatchForBetting = Pick<Match, "id" | "match_date" | "status">;

export function hasMatchStarted(matchDate: string, now = Date.now()): boolean {
  return now >= new Date(matchDate).getTime();
}

export function getBetEligibility(
  match: MatchForBetting,
  now = Date.now()
): { canBet: boolean; lockReason: BetLockReason | null } {
  if (match.status === "finished") {
    return { canBet: false, lockReason: "match_finished" };
  }

  if (hasMatchStarted(match.match_date, now)) {
    return { canBet: false, lockReason: "match_started" };
  }

  if (match.status === "closed") {
    return { canBet: false, lockReason: "match_closed" };
  }

  return { canBet: true, lockReason: null };
}

export function getBetLockMessage(reason: BetLockReason): string {
  switch (reason) {
    case "match_closed":
      return "🔒 Partida fechada para palpites.";
    case "match_finished":
      return "🔒 Partida já finalizada.";
    case "match_started":
      return "🔒 Partida já começou — palpites encerrados.";
  }
}

export function enrichMatchesWithBetting(
  matches: Omit<MatchWithMeta, "can_bet" | "lock_reason">[],
  now = Date.now()
): MatchWithMeta[] {
  return matches.map((match) => {
    const { canBet, lockReason } = getBetEligibility(match, now);
    return {
      ...match,
      can_bet: canBet,
      lock_reason: lockReason,
    };
  });
}
