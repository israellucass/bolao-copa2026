import { userIsLoser } from "./match-settlement";
import type { Match, MatchPrizeSettlement } from "./types";

/** Prazo após o apito final para pagar antes de bloquear palpites. */
export const PAYMENT_GRACE_MS = 24 * 60 * 60 * 1000;

type MatchWithFinish = Pick<
  Match,
  "id" | "match_date" | "status" | "home_score" | "away_score"
> & { finished_at?: string | null };

export function resolveMatchFinishedAt(match: MatchWithFinish): Date {
  if (match.finished_at) return new Date(match.finished_at);
  return new Date(new Date(match.match_date).getTime() + 2 * 60 * 60 * 1000);
}

export function formatElapsedHhMm(elapsedMs: number): string {
  const totalMinutes = Math.max(0, Math.floor(elapsedMs / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatWinnerNamesPt(names: string[]): string {
  const unique = [...new Set(names.filter(Boolean))];
  if (unique.length === 0) return "o vencedor";
  if (unique.length === 1) return unique[0];
  if (unique.length === 2) return `${unique[0]} e ${unique[1]}`;
  return `${unique.slice(0, -1).join(", ")} e ${unique[unique.length - 1]}`;
}

export function formatCaloteiroMessage(
  winnerNames: string[],
  elapsedMs: number
): string {
  return `Pague ${formatWinnerNamesPt(winnerNames)}, caloteiro! Você está devendo há ${formatElapsedHhMm(elapsedMs)}`;
}

export interface PaymentDebtContext {
  userId: string;
  matches: MatchWithFinish[];
  settlements: Map<string, MatchPrizeSettlement>;
  paidByMatchId: Map<string, boolean>;
  predictedMatchIds: Set<string>;
  now?: number;
}

export interface OverduePaymentDebt {
  matchId: string;
  finishedAt: Date;
  elapsedMs: number;
  winnerNames: string[];
  message: string;
}

export function findOverdueUnpaidDebts(
  ctx: PaymentDebtContext
): OverduePaymentDebt[] {
  const now = ctx.now ?? Date.now();
  const debts: OverduePaymentDebt[] = [];

  for (const match of ctx.matches) {
    if (match.status !== "finished") continue;
    if (match.home_score == null || match.away_score == null) continue;
    if (!ctx.predictedMatchIds.has(match.id)) continue;

    const settlement = ctx.settlements.get(match.id);
    if (!settlement || !userIsLoser(settlement, ctx.userId)) continue;
    if (ctx.paidByMatchId.get(match.id)) continue;

    const finishedAt = resolveMatchFinishedAt(match);
    const elapsedMs = now - finishedAt.getTime();
    if (elapsedMs < PAYMENT_GRACE_MS) continue;

    const winnerNames = settlement.winners.map((w) => w.name);
    debts.push({
      matchId: match.id,
      finishedAt,
      elapsedMs,
      winnerNames,
      message: formatCaloteiroMessage(winnerNames, elapsedMs),
    });
  }

  return debts.sort((a, b) => b.elapsedMs - a.elapsedMs);
}

/** Bloqueia palpites em partidas futuras se há dívida vencida em rodada anterior. */
export function buildPaymentBlockMessages(
  ctx: PaymentDebtContext
): Map<string, string> {
  const debts = findOverdueUnpaidDebts(ctx);
  if (debts.length === 0) return new Map();

  const blockingDebt = debts[0];
  const sorted = [...ctx.matches].sort(
    (a, b) =>
      new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
  );

  const earliestDebtDate = Math.min(
    ...debts.map((d) => {
      const m = sorted.find((match) => match.id === d.matchId);
      return m ? new Date(m.match_date).getTime() : Infinity;
    })
  );

  const result = new Map<string, string>();

  for (const match of sorted) {
    if (match.status === "finished") continue;
    if (new Date(match.match_date).getTime() <= earliestDebtDate) continue;
    result.set(match.id, blockingDebt.message);
  }

  return result;
}
