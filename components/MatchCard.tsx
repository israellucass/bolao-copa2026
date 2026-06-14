"use client";

import { useActionState } from "react";
import { MatchTeams } from "@/components/MatchTeams";
import { MatchWinnersHighlight } from "@/components/MatchWinnersHighlight";
import { TeamLabel } from "@/components/TeamLabel";
import { savePrediction, type PredictionState } from "@/lib/actions/predictions";
import { getBetLockMessage, hasMatchStarted } from "@/lib/betting";
import { formatAmountBRL, formatMatchDate } from "@/lib/format";
import { userIsLoser, userIsWinner } from "@/lib/match-settlement";
import { cn } from "@/lib/cn";
import { theme } from "@/lib/theme";
import type { MatchWithMeta } from "@/lib/types";
import { PredictionTimeline } from "./PredictionTimeline";
import { MatchSettlementPanel } from "./MatchSettlementPanel";
import { StatusBadge } from "./StatusBadge";

const initialState: PredictionState = {};

interface MatchCardProps {
  match: MatchWithMeta;
  currentUserId: string;
  /** Destaque para quem não venceu e deve pagar os vencedores. */
  emphasized?: boolean;
}

export function MatchCard({
  match,
  currentUserId,
  emphasized = false,
}: MatchCardProps) {
  const [state, formAction, pending] = useActionState(
    savePrediction,
    initialState
  );

  const canBet = match.can_bet;
  const isFinished = match.status === "finished";
  const canStillChange =
    match.status === "open" && !hasMatchStarted(match.match_date);
  const settlement = match.prize_settlement;
  const isLoser = isFinished && userIsLoser(settlement, currentUserId);
  const isWinner = isFinished && userIsWinner(settlement, currentUserId);
  const owesPayment = isLoser && match.payment_status === "pending";
  const showLoserHighlight = owesPayment && emphasized;

  return (
    <article
      className={cn(
        theme.card,
        showLoserHighlight &&
          "ring-2 ring-amber-500/50 shadow-[0_0_24px_rgba(245,158,11,0.12)]",
        isFinished && !showLoserHighlight && "opacity-95"
      )}
    >
      <div
        className={cn(
          theme.cardHeader,
          showLoserHighlight && "border-amber-800/60 bg-amber-950/30"
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <MatchTeams
              homeTeam={match.home_team}
              awayTeam={match.away_team}
              size="lg"
            />
            <p className={theme.meta}>{formatMatchDate(match.match_date)}</p>
          </div>
          <div className="flex flex-row flex-wrap gap-2 sm:flex-col sm:items-end">
            <StatusBadge status={match.status} />
            {showLoserHighlight && (
              <span className="inline-flex items-center rounded-lg border border-amber-700/60 bg-amber-950/50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-200">
                Pague o vencedor
              </span>
            )}
            {isFinished && isWinner && (
              <span className="inline-flex items-center rounded-lg border border-lime-700/60 bg-lime-950/50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-lime-300">
                Você venceu
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 py-5 sm:px-5 sm:py-6">
        {!isFinished && (
          <div className="flex items-center justify-between gap-3 text-base">
            <span className="font-medium text-stone-300">Valor da aposta</span>
            <span
              className={`inline-flex items-center gap-2 ${theme.accentText}`}
            >
              <span
                className="rounded-md bg-lime-950/60 px-2 py-1 text-sm font-bold text-lime-400 ring-1 ring-lime-800/50"
                aria-hidden
              >
                R$
              </span>
              <span className="text-lg font-bold">
                {formatAmountBRL(match.cost_brl)}
              </span>
            </span>
          </div>
        )}

        {isFinished && match.home_score != null && match.away_score != null && (
          <div className="space-y-4">
            {showLoserHighlight && settlement && (
              <MatchWinnersHighlight
                settlement={settlement}
                currentUserId={currentUserId}
              />
            )}

            {settlement && isWinner && (
              <MatchSettlementPanel
                settlement={settlement}
                currentUserId={currentUserId}
                variant="winner"
              />
            )}

            <div
              className={cn(
                "rounded-xl border px-4 py-4 text-center",
                showLoserHighlight
                  ? "border-amber-800/50 bg-amber-950/20"
                  : "border-stone-800 bg-stone-950/60"
              )}
            >
              <p className="text-sm font-bold uppercase tracking-wide text-stone-400">
                Resultado final
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight text-amber-50 sm:text-4xl">
                {match.home_score} × {match.away_score}
              </p>
              {match.prediction && (
                <p className="mt-2 text-sm text-stone-400">
                  Seu palpite: {match.prediction.home_score} ×{" "}
                  {match.prediction.away_score}
                </p>
              )}
              {match.prediction?.points != null && (
                <p
                  className={cn(
                    "mt-1 text-base font-semibold",
                    isWinner ? "text-lime-400" : "text-stone-300"
                  )}
                >
                  {match.prediction.points} pts
                </p>
              )}
            </div>

            {!settlement && (
              <p className="rounded-xl border border-stone-800 bg-stone-950/50 px-4 py-3 text-center text-sm text-stone-400">
                Nenhum vencedor nesta rodada — o valor acumula para a próxima
                partida.
              </p>
            )}
          </div>
        )}

        {!isFinished && (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="match_id" value={match.id} />

            <div>
              <p className={theme.label}>Seu palpite</p>
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
                  <label
                    htmlFor={`home-${match.id}`}
                    className="flex w-full flex-col items-center"
                  >
                    <TeamLabel
                      name={match.home_team}
                      size="sm"
                      layout="stacked"
                      className="font-semibold text-stone-200"
                    />
                  </label>
                  <input
                    id={`home-${match.id}`}
                    name="home_score"
                    type="number"
                    min={0}
                    max={20}
                    defaultValue={match.prediction?.home_score ?? 0}
                    disabled={!canBet || pending}
                    className={theme.scoreInput}
                  />
                </div>
                <span
                  className="shrink-0 text-2xl font-light text-stone-500"
                  aria-hidden
                >
                  ×
                </span>
                <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
                  <label
                    htmlFor={`away-${match.id}`}
                    className="flex w-full flex-col items-center"
                  >
                    <TeamLabel
                      name={match.away_team}
                      size="sm"
                      layout="stacked"
                      className="font-semibold text-stone-200"
                    />
                  </label>
                  <input
                    id={`away-${match.id}`}
                    name="away_score"
                    type="number"
                    min={0}
                    max={20}
                    defaultValue={match.prediction?.away_score ?? 0}
                    disabled={!canBet || pending}
                    className={theme.scoreInput}
                  />
                </div>
              </div>
            </div>

          {!canBet && match.bet_lock_message && (
            <p
              className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-3 text-center text-sm font-bold leading-snug text-red-200"
              role="alert"
            >
              {match.bet_lock_message}
            </p>
          )}

          {!canBet && match.lock_reason && !match.bet_lock_message && (
            <p className={theme.alertWarning}>
              {getBetLockMessage(match.lock_reason)}
            </p>
          )}

            {state.error && <p className={theme.alertError}>{state.error}</p>}
            {state.success && (
              <p className={theme.alertSuccess}>{state.success}</p>
            )}

            {canBet && (
              <button
                type="submit"
                disabled={pending}
                className={theme.btnPrimaryFull}
              >
                {pending ? "Salvando..." : "Salvar palpite"}
              </button>
            )}
          </form>
        )}

        {!isFinished && (
          <PredictionTimeline
            entries={match.prediction_log}
            currentUserId={currentUserId}
            canStillChange={canStillChange}
          />
        )}
      </div>
    </article>
  );
}
