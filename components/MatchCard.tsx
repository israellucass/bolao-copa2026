"use client";

import { useActionState } from "react";
import { savePrediction, type PredictionState } from "@/lib/actions/predictions";
import { getBetLockMessage } from "@/lib/betting";
import {
  formatAmountBRL,
  formatMatchDate,
  formatTeamName,
} from "@/lib/format";
import { theme } from "@/lib/theme";
import type { MatchWithMeta } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

const initialState: PredictionState = {};

interface MatchCardProps {
  match: MatchWithMeta;
}

export function MatchCard({ match }: MatchCardProps) {
  const [state, formAction, pending] = useActionState(
    savePrediction,
    initialState
  );

  const canBet = match.can_bet;
  const isFinished = match.status === "finished";

  return (
    <article className={theme.card}>
      <div className={theme.cardHeader}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-bold leading-snug text-amber-100 sm:text-lg">
              {formatTeamName(match.home_team)}{" "}
              <span className="font-normal text-stone-600">vs</span>{" "}
              {formatTeamName(match.away_team)}
            </h2>
            <p className="mt-0.5 text-xs text-stone-400">
              {formatMatchDate(match.match_date)}
            </p>
          </div>
          <div className="flex flex-row flex-wrap gap-1.5 sm:flex-col sm:items-end">
            <StatusBadge status={match.status} />
            <StatusBadge status={match.payment_status} />
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-400">Valor da aposta</span>
          <span className={`inline-flex items-center gap-1.5 ${theme.accentText}`}>
            <span
              className="rounded-md bg-lime-950/60 px-1.5 py-0.5 text-xs font-bold text-lime-400 ring-1 ring-lime-800/50"
              aria-hidden
            >
              R$
            </span>
            {formatAmountBRL(match.cost_brl)}
          </span>
        </div>

        {isFinished && match.home_score != null && match.away_score != null && (
          <div className="rounded-xl border border-stone-800 bg-stone-950/60 px-3 py-2 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Resultado final
            </p>
            <p className="text-2xl font-black text-amber-100">
              {match.home_score} × {match.away_score}
            </p>
            {match.prediction?.points != null && (
              <p className="mt-1 text-sm font-semibold text-lime-400">
                Seus pontos: {match.prediction.points} pts
              </p>
            )}
          </div>
        )}

        <form action={formAction} className="space-y-3">
          <input type="hidden" name="match_id" value={match.id} />

          <div>
            <p className={theme.label}>Seu palpite</p>
            <div className="flex items-center justify-center gap-4 sm:gap-5">
              <div className="text-center">
                <label
                  htmlFor={`home-${match.id}`}
                  className={theme.labelInline}
                >
                  {formatTeamName(match.home_team)}
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
              <span className="pt-5 text-xl font-light text-stone-600">×</span>
              <div className="text-center">
                <label
                  htmlFor={`away-${match.id}`}
                  className={theme.labelInline}
                >
                  {formatTeamName(match.away_team)}
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
