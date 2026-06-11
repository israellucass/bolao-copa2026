import type { BetLockReason, Match, MatchWithMeta } from "./types";

type MatchForBetting = Pick<Match, "id" | "match_date" | "status">;

export function hasMatchStarted(matchDate: string, now = Date.now()): boolean {
  return now >= new Date(matchDate).getTime();
}

/** Próxima partida ainda não iniciada com status "open". */
export function getNextBettableMatchId(
  matches: MatchForBetting[],
  now = Date.now()
): string | null {
  const next = matches
    .filter(
      (m) =>
        m.status === "open" && new Date(m.match_date).getTime() > now
    )
    .sort(
      (a, b) =>
        new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
    )[0];

  return next?.id ?? null;
}

export function getBetEligibility(
  match: MatchForBetting,
  nextMatchId: string | null,
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

  if (nextMatchId !== match.id) {
    return { canBet: false, lockReason: "not_next_match" };
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
    case "not_next_match":
      return "🔒 Apenas a próxima partida aceita palpites. Aguarde o jogo anterior.";
  }
}

export function enrichMatchesWithBetting(
  matches: Omit<MatchWithMeta, "can_bet" | "lock_reason">[],
  now = Date.now()
): MatchWithMeta[] {
  const nextMatchId = getNextBettableMatchId(matches, now);

  return matches.map((match) => {
    const { canBet, lockReason } = getBetEligibility(
      match,
      nextMatchId,
      now
    );
    return {
      ...match,
      can_bet: canBet,
      lock_reason: lockReason,
    };
  });
}
