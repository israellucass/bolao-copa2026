"use client";

import { useActionState } from "react";
import { MatchTeams } from "@/components/MatchTeams";
import { TeamLabel } from "@/components/TeamLabel";
import { savePrediction, type PredictionState } from "@/lib/actions/predictions";
import { getBetLockMessage } from "@/lib/betting";
import { formatAmountBRL, formatMatchDate } from "@/lib/format";
import { theme } from "@/lib/theme";
import type { MatchWithMeta } from "@/lib/types";
import { MatchSettlementPanel } from "./MatchSettlementPanel";
import { StatusBadge } from "./StatusBadge";

const initialState: PredictionState = {};

interface MatchCardProps {
  match: MatchWithMeta;
  currentUserId: string;
}

export function MatchCard({ match, currentUserId }: MatchCardProps) {
  const [state, formAction, pending] = useActionState(
    savePrediction,
    initialState
  );

  const canBet = match.can_bet;
  const isFinished = match.status === "finished";

  return (
    <article className={theme.card}>
      <div className={theme.cardHeader}>
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
            {isFinished && <StatusBadge status={match.payment_status} />}
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 py-5 sm:px-5 sm:py-6">
        <div className="flex items-center justify-between gap-3 text-base">
          <span className="font-medium text-stone-300">Valor da aposta</span>
          <span className={`inline-flex items-center gap-2 ${theme.accentText}`}>
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

        {isFinished && match.home_score != null && match.away_score != null && (
          <div className="space-y-4">
            <div className="rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-4 text-center">
              <p className="text-sm font-bold uppercase tracking-wide text-stone-400">
                Resultado final
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight text-amber-50 sm:text-4xl">
                {match.home_score} × {match.away_score}
              </p>
              {match.prediction?.points != null && (
                <p className="mt-2 text-base font-semibold text-lime-400">
                  Seus pontos: {match.prediction.points} pts
                </p>
              )}
            </div>
            {match.prize_settlement ? (
              <MatchSettlementPanel
                settlement={match.prize_settlement}
                currentUserId={currentUserId}
              />
            ) : (
              <p className="rounded-xl border border-stone-800 bg-stone-950/50 px-4 py-3 text-center text-sm text-stone-400">
                Nenhum vencedor nesta rodada — o valor acumula para a próxima
                partida.
              </p>
            )}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="match_id" value={match.id} />

          <div>
            <p className={theme.label}>Seu palpite</p>
            <div className="flex items-end justify-center gap-4 sm:gap-6">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <label htmlFor={`home-${match.id}`} className="w-full">
                  <TeamLabel
                    name={match.home_team}
                    size="sm"
                    className="justify-center font-semibold text-stone-200"
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
              <span className="pb-4 text-2xl font-light text-stone-500">×</span>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <label htmlFor={`away-${match.id}`} className="w-full">
                  <TeamLabel
                    name={match.away_team}
                    size="sm"
                    className="justify-center font-semibold text-stone-200"
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

          {!canBet && match.lock_reason && (
            <p className={theme.alertWarning}>
              {getBetLockMessage(match.lock_reason)}
            </p>
          )}

          {state.error && <p className={theme.alertError}>{state.error}</p>}
          {state.success && <p className={theme.alertSuccess}>{state.success}</p>}

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
      </div>
    </article>
  );
}
