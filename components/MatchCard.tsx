"use client";

import { useActionState } from "react";
import { savePrediction, type PredictionState } from "@/lib/actions/predictions";
import { getBetLockMessage } from "@/lib/betting";
import { formatCurrencyBRL, formatMatchDate, formatTeamName } from "@/lib/format";
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
    <article className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm ring-1 ring-black/5">
      <div className="bg-gradient-to-r from-emerald-50 to-yellow-50 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-emerald-950">
              {formatTeamName(match.home_team)}{" "}
              <span className="font-normal text-gray-400">vs</span>{" "}
              {formatTeamName(match.away_team)}
            </h2>
            <p className="mt-0.5 text-xs text-gray-600">
              {formatMatchDate(match.match_date)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={match.status} />
            <StatusBadge status={match.payment_status} />
          </div>
        </div>
      </div>

      <div className="space-y-3 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Valor da aposta</span>
          <span className="font-semibold text-emerald-700">
            {formatCurrencyBRL(match.cost_brl)}
          </span>
        </div>

        {isFinished && match.home_score != null && match.away_score != null && (
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Resultado final
            </p>
            <p className="text-2xl font-black text-emerald-900">
              {match.home_score} × {match.away_score}
            </p>
            {match.prediction?.points != null && (
              <p className="mt-1 text-sm font-semibold text-yellow-700">
                Seus pontos: {match.prediction.points} pts
              </p>
            )}
          </div>
        )}

        <form action={formAction} className="space-y-3">
          <input type="hidden" name="match_id" value={match.id} />

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Seu palpite
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="text-center">
                <label
                  htmlFor={`home-${match.id}`}
                  className="mb-1 block text-xs font-medium text-gray-600"
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
                  className="w-16 rounded-xl border border-gray-200 bg-white px-2 py-2 text-center text-lg font-bold text-emerald-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
              <span className="pt-5 text-xl font-light text-gray-300">×</span>
              <div className="text-center">
                <label
                  htmlFor={`away-${match.id}`}
                  className="mb-1 block text-xs font-medium text-gray-600"
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
                  className="w-16 rounded-xl border border-gray-200 bg-white px-2 py-2 text-center text-lg font-bold text-emerald-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
            </div>
          </div>

          {!canBet && match.lock_reason && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-center text-xs text-amber-800">
              {getBetLockMessage(match.lock_reason)}
            </p>
          )}

          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-700">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs text-emerald-700">
              {state.success}
            </p>
          )}

          {canBet && (
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-3 text-sm font-bold text-white shadow-md transition hover:from-emerald-700 hover:to-green-700 disabled:opacity-60"
            >
              {pending ? "Salvando..." : "Salvar palpite"}
            </button>
          )}
        </form>
      </div>
    </article>
  );
}
