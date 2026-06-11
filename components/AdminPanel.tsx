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
import { formatCurrencyBRL, formatMatchDate, formatTeamName } from "@/lib/format";
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
  const [statusPending, startStatusTransition] = useTransition();
  const [paymentPending, startPaymentTransition] = useTransition();

  const paymentKey = (userId: string, matchId: string) =>
    `${userId}:${matchId}`;

  const paymentMap = new Map(
    payments.map((p) => [paymentKey(p.user_id, p.match_id), p.paid])
  );

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

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
            {matches.map((match) => (
              <div
                key={match.id}
                className="rounded-xl border border-stone-800 bg-stone-950/50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-amber-100">
                      {formatTeamName(match.home_team)} vs{" "}
                      {formatTeamName(match.away_team)}
                    </p>
                    <p className="text-xs text-stone-400">
                      {formatMatchDate(match.match_date)} ·{" "}
                      {formatCurrencyBRL(match.cost_brl)}
                    </p>
                  </div>
                  <StatusBadge status={match.status} />
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
            ))}
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
          Ao salvar o placar final, a pontuação de todos os palpites é
          calculada automaticamente.
        </p>

        <form action={finishAction} className="space-y-3">
          <select name="match_id" required className={theme.select}>
            <option value="">Selecione a partida</option>
            {matches
              .filter((m) => m.status !== "finished")
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {formatTeamName(m.home_team)} vs {formatTeamName(m.away_team)}
                </option>
              ))}
          </select>

          {selectedMatch && (
            <p className="text-xs text-stone-400">
              Partida selecionada nos pagamentos:{" "}
              <strong className="text-amber-100">
                {formatTeamName(selectedMatch.home_team)} vs{" "}
                {formatTeamName(selectedMatch.away_team)}
              </strong>
            </p>
          )}

          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <label className={theme.labelInline}>Mandante</label>
              <input
                name="home_score"
                type="number"
                min={0}
                max={20}
                required
                defaultValue={0}
                className={theme.scoreInput}
              />
            </div>
            <span className="pt-5 text-stone-600">×</span>
            <div className="text-center">
              <label className={theme.labelInline}>Visitante</label>
              <input
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

          {finishState.error && (
            <p className="text-xs text-red-300">{finishState.error}</p>
          )}
          {finishState.success && (
            <p className="text-xs text-lime-400">{finishState.success}</p>
          )}

          <button
            type="submit"
            disabled={finishPending}
            className={`${theme.btnPrimary} w-full`}
          >
            {finishPending ? "Calculando..." : "Finalizar e calcular pontos"}
          </button>
        </form>
      </section>
    </div>
  );
}
