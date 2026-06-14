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

interface MatchScoreEntryFormProps {
  match: Match;
  action: (payload: FormData) => void;
  pending: boolean;
  state: AdminState;
  submitLabel: string;
  onCancel?: () => void;
}

function MatchScoreEntryForm({
  match,
  action,
  pending,
  state,
  submitLabel,
  onCancel,
}: MatchScoreEntryFormProps) {
  const defaultHome = match.home_score ?? 0;
  const defaultAway = match.away_score ?? 0;

  return (
    <form
      action={action}
      className="mt-3 space-y-3 rounded-xl border border-lime-800/40 bg-stone-950/60 p-3"
    >
      <input type="hidden" name="match_id" value={match.id} />
      <p className="text-sm font-semibold text-lime-400">Placar final</p>
      <p className="text-xs text-stone-400">
        Informe o resultado para calcular pontos e definir o(s) vencedor(es).
      </p>

      <div className="flex items-center justify-center gap-4 sm:gap-8">
        <div className="flex flex-col items-center gap-3">
          <label
            htmlFor={`score-home-${match.id}`}
            className="flex flex-col items-center"
          >
            <TeamLabel
              name={match.home_team}
              size="sm"
              layout="stacked"
              className="font-semibold text-stone-200"
            />
          </label>
          <input
            id={`score-home-${match.id}`}
            name="home_score"
            type="number"
            min={0}
            max={20}
            required
            defaultValue={defaultHome}
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
            htmlFor={`score-away-${match.id}`}
            className="flex flex-col items-center"
          >
            <TeamLabel
              name={match.away_team}
              size="sm"
              layout="stacked"
              className="font-semibold text-stone-200"
            />
          </label>
          <input
            id={`score-away-${match.id}`}
            name="away_score"
            type="number"
            min={0}
            max={20}
            required
            defaultValue={defaultAway}
            className={theme.scoreInput}
          />
        </div>
      </div>

      {state.error && <p className="text-xs text-red-300">{state.error}</p>}
      {state.success && <p className="text-xs text-lime-400">{state.success}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className={`${theme.btnPrimary} flex-1`}
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`${theme.btnGhost} px-4`}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
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
  const [showImportSync, setShowImportSync] = useState(false);
  const [scoringMatchId, setScoringMatchId] = useState<string | null>(null);
  const [statusPending, startStatusTransition] = useTransition();
  const [paymentPending, startPaymentTransition] = useTransition();

  const paymentKey = (userId: string, matchId: string) =>
    `${userId}:${matchId}`;

  const paymentMap = new Map(
    payments.map((p) => [paymentKey(p.user_id, p.match_id), p.paid])
  );

  const scorePendingMatches = matches.filter(matchScorePending);

  function handleStatusChange(matchId: string, status: "open" | "closed") {
    startStatusTransition(async () => {
      await updateMatchStatus(matchId, status);
    });
  }

  function handlePaymentToggle(userId: string, matchId: string, paid: boolean) {
    startPaymentTransition(async () => {
      await togglePayment(userId, matchId, paid);
    });
  }

  function openScoreForm(matchId: string) {
    setScoringMatchId(matchId);
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
            Lance o resultado em Gerenciar partidas para calcular pontos e
            vencedores.
          </p>
        </section>
      )}

      {/* API Sync — collapsed */}
      <section className={theme.cardInner}>
        <button
          type="button"
          onClick={() => setShowImportSync((open) => !open)}
          className="flex w-full items-center justify-between gap-3 text-left"
          aria-expanded={showImportSync}
        >
          <span className="text-base font-bold text-amber-100">
            Importar jogos do Brasil
          </span>
          <span className="shrink-0 text-stone-500" aria-hidden>
            {showImportSync ? "▾" : "▸"}
          </span>
        </button>

        {showImportSync && (
          <div className="mt-3 border-t border-stone-800 pt-3">
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
          </div>
        )}
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

      {/* Match list, status & score entry */}
      <section className={theme.cardInner}>
        <h2 className="mb-1 text-base font-bold text-amber-100">
          Gerenciar partidas
        </h2>
        <p className={`mb-3 ${theme.subheading}`}>
          Para finalizar, informe o placar. Partidas já finalizadas podem ter o
          resultado editado.
        </p>
        {matches.length === 0 ? (
          <p className={theme.subheading}>Nenhuma partida cadastrada.</p>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => {
              const scorePending = matchScorePending(match);
              const hasScore = matchHasFinalScore(match);
              const isFinished = match.status === "finished";
              const showScoreForm =
                scoringMatchId === match.id || scorePending;

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
                          Placar pendente — informe o resultado
                        </p>
                      )}
                      {hasScore && (
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
                    {(["open", "closed"] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={
                          statusPending || isFinished || match.status === status
                        }
                        onClick={() => handleStatusChange(match.id, status)}
                        className={`${theme.btnChip} ${
                          match.status === status
                            ? "bg-lime-400 text-stone-950"
                            : "bg-stone-900 text-stone-400 ring-1 ring-stone-700 hover:bg-stone-800 hover:text-amber-100"
                        } disabled:opacity-50`}
                      >
                        {status === "open" ? "Abrir" : "Fechar"}
                      </button>
                    ))}

                    {!isFinished && !showScoreForm && (
                      <button
                        type="button"
                        onClick={() => openScoreForm(match.id)}
                        className={`${theme.btnChip} bg-lime-950/60 text-lime-400 ring-1 ring-lime-800/60 hover:bg-lime-950`}
                      >
                        Finalizar
                      </button>
                    )}

                    {hasScore && !showScoreForm && (
                      <button
                        type="button"
                        onClick={() => openScoreForm(match.id)}
                        className={`${theme.btnChip} bg-stone-900 text-amber-100 ring-1 ring-stone-700 hover:bg-stone-800`}
                      >
                        Editar placar
                      </button>
                    )}

                    {scorePending && !showScoreForm && (
                      <button
                        type="button"
                        onClick={() => openScoreForm(match.id)}
                        className={`${theme.btnChip} bg-amber-950/60 text-amber-200 ring-1 ring-amber-800/60 hover:bg-amber-950`}
                      >
                        Lançar resultado
                      </button>
                    )}
                  </div>

                  {showScoreForm && (
                    <MatchScoreEntryForm
                      match={match}
                      action={finishAction}
                      pending={finishPending}
                      state={
                        scoringMatchId === match.id || scorePending
                          ? finishState
                          : initialState
                      }
                      submitLabel={
                        hasScore ? "Salvar placar" : "Finalizar partida"
                      }
                      onCancel={
                        scorePending
                          ? undefined
                          : () => setScoringMatchId(null)
                      }
                    />
                  )}
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
    </div>
  );
}
