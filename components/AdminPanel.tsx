"use client";

import { useActionState, useState, useTransition } from "react";
import {
  createMatch,
  finishMatchWithScore,
  togglePayment,
  updateMatchStatus,
  type AdminState,
} from "@/lib/actions/admin";
import { syncBrazilMatches } from "@/lib/actions/sync-matches";
import { CurrencyInput } from "@/components/CurrencyInput";
import { MatchTeams } from "@/components/MatchTeams";
import { TeamLabel } from "@/components/TeamLabel";
import { formatCurrencyBRL, formatMatchDate, formatTeamName } from "@/lib/format";
import {
  matchHasFinalScore,
  matchNeedsScoreEntry,
  matchScorePending,
} from "@/lib/match-score";
import { theme } from "@/lib/theme";
import type { Match, User } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

const initialState: AdminState = {};

interface AdminPanelProps {
  matches: Match[];
  users: User[];
  payments: { user_id: string; match_id: string; paid: boolean }[];
}

export function AdminPanel({ matches, users, payments }: AdminPanelProps) {
  const [syncState, syncAction, syncPending] = useActionState(
    syncBrazilMatches,
    initialState
  );
  const [createState, createAction, createPending] = useActionState(
    createMatch,
    initialState
  );
  const [finishState, finishAction, finishPending] = useActionState(
    finishMatchWithScore,
    initialState
  );
  const [selectedMatchId, setSelectedMatchId] = useState(
    matches[0]?.id ?? ""
  );
  const [finishMatchId, setFinishMatchId] = useState("");
  const [statusPending, startStatusTransition] = useTransition();
  const [paymentPending, startPaymentTransition] = useTransition();

  const paymentKey = (userId: string, matchId: string) =>
    `${userId}:${matchId}`;

  const paymentMap = new Map(
    payments.map((p) => [paymentKey(p.user_id, p.match_id), p.paid])
  );

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);
  const finishMatch = matches.find((m) => m.id === finishMatchId);
  const scorePendingMatches = matches.filter(matchScorePending);
  const finishableMatches = matches.filter(matchNeedsScoreEntry);

  function handleStatusChange(matchId: string, status: "open" | "closed" | "finished") {
    startStatusTransition(async () => {
      await updateMatchStatus(matchId, status);
    });
  }

  function handlePaymentToggle(userId: string, matchId: string, paid: boolean) {
    startPaymentTransition(async () => {
      await togglePayment(userId, matchId, paid);
    });
  }

  return (
    <div className="space-y-6">
      {scorePendingMatches.length > 0 && (
        <section
          className="rounded-2xl border border-amber-700/60 bg-amber-950/30 px-4 py-4 ring-1 ring-amber-600/30"
          role="status"
        >
          <p className="text-sm font-bold text-amber-200">
            Placar pendente ({scorePendingMatches.length})
          </p>
          <p className={`mt-1 ${theme.subheading}`}>
            {scorePendingMatches.length === 1
              ? "Esta partida foi finalizada sem placar. Lance o resultado abaixo para calcular pontos e vencedores."
              : "Estas partidas foram finalizadas sem placar. Lance os resultados abaixo para calcular pontos e vencedores."}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-amber-100">
            {scorePendingMatches.map((match) => (
              <li key={match.id}>
                {formatTeamName(match.home_team)} vs{" "}
                {formatTeamName(match.away_team)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* API Sync */}
      <section className={theme.cardInner}>
        <h2 className="mb-1 text-base font-bold text-amber-100">
          Importar jogos do Brasil
        </h2>
        <p className={`mb-3 ${theme.subheading}`}>
          Busca automaticamente os jogos da Seleção na Copa 2026 via
          football-data.org.
        </p>
        <form action={syncAction} className="space-y-3">
          <CurrencyInput
            id="sync-cost-brl"
            name="cost_brl"
            label="Valor da aposta"
            required
          />
          {syncState.error && (
            <p className="text-xs text-red-300">{syncState.error}</p>
          )}
          {syncState.success && (
            <p className="text-xs text-lime-400">{syncState.success}</p>
          )}
          <button
            type="submit"
            disabled={syncPending}
            className={`${theme.btnPrimary} w-full`}
          >
            {syncPending
              ? "Buscando jogos..."
              : "Importar jogos da Copa 2026"}
          </button>
        </form>
      </section>

      {/* Create Match */}
      <section className={theme.cardInner}>
        <h2 className="mb-3 text-base font-bold text-amber-100">
          Nova partida (manual)
        </h2>
        <form action={createAction} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2">
            <div>
              <label className={theme.labelInline}>Mandante</label>
              <input
                name="home_team"
                defaultValue="Brasil"
                required
                className={theme.input}
              />
            </div>
            <div>
              <label className={theme.labelInline}>Visitante</label>
              <input
                name="away_team"
                placeholder="Adversário"
                required
                className={theme.input}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2">
            <div>
              <label className={theme.labelInline}>Data e hora</label>
              <input
                name="match_date"
                type="datetime-local"
                required
                className={theme.input}
              />
            </div>
            <CurrencyInput
              id="create-cost-brl"
              name="cost_brl"
              label="Valor da aposta"
              required
            />
          </div>
          {createState.error && (
            <p className="text-xs text-red-300">{createState.error}</p>
          )}
          {createState.success && (
            <p className="text-xs text-lime-400">{createState.success}</p>
          )}
          <button
            type="submit"
            disabled={createPending}
            className={`${theme.btnPrimary} w-full`}
          >
            {createPending ? "Criando..." : "Adicionar partida"}
          </button>
        </form>
      </section>

      {/* Match list & status */}
      <section className={theme.cardInner}>
        <h2 className="mb-3 text-base font-bold text-amber-100">
          Gerenciar partidas
        </h2>
        {matches.length === 0 ? (
          <p className={theme.subheading}>Nenhuma partida cadastrada.</p>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => {
              const scorePending = matchScorePending(match);

              return (
              <div
                key={match.id}
                className={`rounded-xl border bg-stone-950/50 p-3 ${
                  scorePending
                    ? "border-amber-700/60 ring-1 ring-amber-600/20"
                    : "border-stone-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <MatchTeams
                      homeTeam={match.home_team}
                      awayTeam={match.away_team}
                      size="sm"
                    />
                    <p className={theme.meta}>
                      {formatMatchDate(match.match_date)} ·{" "}
                      {formatCurrencyBRL(match.cost_brl)}
                    </p>
                    {scorePending && (
                      <p className="text-xs font-semibold text-amber-300">
                        Placar pendente — lance o resultado
                      </p>
                    )}
                    {matchHasFinalScore(match) && (
                      <p className="text-xs font-medium text-stone-400">
                        Resultado: {match.home_score} × {match.away_score}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <StatusBadge status={match.status} />
                    {scorePending && (
                      <span className="inline-flex items-center rounded-full bg-amber-950 px-2.5 py-0.5 text-xs font-semibold text-amber-300 ring-1 ring-inset ring-amber-800">
                        Placar pendente
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["open", "closed", "finished"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={statusPending || match.status === status}
                      onClick={() => handleStatusChange(match.id, status)}
                      className={`${theme.btnChip} ${
                        match.status === status
                          ? "bg-lime-400 text-stone-950"
                          : "bg-stone-900 text-stone-400 ring-1 ring-stone-700 hover:bg-stone-800 hover:text-amber-100"
                      } disabled:opacity-50`}
                    >
                      {status === "open"
                        ? "Abrir"
                        : status === "closed"
                          ? "Fechar"
                          : "Finalizar"}
                    </button>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Payment tracker */}
      <section className={theme.cardInner}>
        <h2 className="mb-1 text-base font-bold text-amber-100">
          Controle de pagamentos
        </h2>
        <p className={`mb-3 ${theme.subheading}`}>
          Marque quando cada jogador enviar o Pix ao vencedor da partida.
        </p>

        {matches.length > 0 && (
          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className={`mb-3 ${theme.select}`}
          >
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {formatTeamName(m.home_team)} vs {formatTeamName(m.away_team)}
              </option>
            ))}
          </select>
        )}

        <div className="divide-y divide-stone-800 rounded-xl border border-stone-800">
          {users.map((user) => {
            const paid =
              paymentMap.get(paymentKey(user.id, selectedMatchId)) ?? false;
            return (
              <div
                key={user.id}
                className="flex min-h-14 items-center justify-between gap-3 px-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-amber-100">
                    {user.name ?? "Sem nome"}
                  </p>
                  {user.whatsapp && (
                    <p className="text-xs text-stone-500">{user.whatsapp}</p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={paymentPending || !selectedMatchId}
                  onClick={() =>
                    handlePaymentToggle(user.id, selectedMatchId, !paid)
                  }
                  className={`relative h-8 w-[3.25rem] shrink-0 rounded-full transition ${
                    paid ? "bg-emerald-600" : "bg-amber-900"
                  } disabled:opacity-50`}
                  aria-label={`Pagamento de ${user.name}: ${paid ? "pago" : "pendente"}`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-stone-200 shadow transition ${
                      paid ? "left-[1.35rem]" : "left-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-medium uppercase text-stone-500">
          <span>Pix pendente</span>
          <span>Pix enviado</span>
        </div>
      </section>

      {/* Result entry */}
      <section className="rounded-2xl border border-stone-700 bg-gradient-to-b from-stone-900 to-stone-950 p-4 shadow-lg ring-1 ring-lime-500/10">
        <h2 className="mb-1 text-base font-bold text-amber-100">
          Lançar resultado
        </h2>
        <p className={`mb-3 ${theme.subheading}`}>
          Informe o placar final. A pontuação é calculada e quem tiver mais
          pontos vira vencedor da rodada.
        </p>

        <form action={finishAction} className="space-y-3">
          <label htmlFor="finish-match" className={theme.label}>
            Partida
          </label>
          <select
            id="finish-match"
            name="match_id"
            required
            value={finishMatchId}
            onChange={(e) => setFinishMatchId(e.target.value)}
            className={theme.select}
          >
            <option value="">Selecione a partida</option>
            {finishableMatches.map((m) => (
                <option key={m.id} value={m.id}>
                  {formatTeamName(m.home_team)} vs {formatTeamName(m.away_team)}
                  {matchScorePending(m) ? " (placar pendente)" : ""}
                </option>
              ))}
          </select>

          {finishMatch && (
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              <div className="flex flex-col items-center gap-3">
                <label
                  htmlFor="finish-home-score"
                  className="flex flex-col items-center"
                >
                  <TeamLabel
                    name={finishMatch.home_team}
                    size="sm"
                    layout="stacked"
                    className="font-semibold text-stone-200"
                  />
                </label>
                <input
                  id="finish-home-score"
                  name="home_score"
                  type="number"
                  min={0}
                  max={20}
                  required
                  defaultValue={0}
                  className={theme.scoreInput}
                />
              </div>
              <span
                className="shrink-0 text-2xl font-light text-stone-500"
                aria-hidden
              >
                ×
              </span>
              <div className="flex flex-col items-center gap-3">
                <label
                  htmlFor="finish-away-score"
                  className="flex flex-col items-center"
                >
                  <TeamLabel
                    name={finishMatch.away_team}
                    size="sm"
                    layout="stacked"
                    className="font-semibold text-stone-200"
                  />
                </label>
                <input
                  id="finish-away-score"
                  name="away_score"
                  type="number"
                  min={0}
                  max={20}
                  required
                  defaultValue={0}
                  className={theme.scoreInput}
                />
              </div>
            </div>
          )}

          {finishState.error && (
            <p className="text-xs text-red-300">{finishState.error}</p>
          )}
          {finishState.success && (
            <p className="text-xs text-lime-400">{finishState.success}</p>
          )}

          <button
            type="submit"
            disabled={finishPending || !finishMatchId}
            className={`${theme.btnPrimary} w-full`}
          >
            {finishPending ? "Finalizando..." : "Finalizar partida"}
          </button>
        </form>
      </section>
    </div>
  );
}
