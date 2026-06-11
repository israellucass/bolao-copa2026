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
import { formatCurrencyBRL, formatMatchDate, formatTeamName } from "@/lib/format";
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
      <section className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-4 shadow-sm">
        <h2 className="mb-1 text-base font-bold text-emerald-950">
          Importar jogos do Brasil
        </h2>
        <p className="mb-3 text-xs text-gray-500">
          Busca automaticamente os jogos da Seleção Brasileira na Copa do Mundo
          2026 via football-data.org e cadastra no bolão.
        </p>
        <form action={syncAction} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Valor da aposta (R$)
            </label>
            <input
              name="cost_brl"
              type="number"
              step="0.01"
              min="1"
              defaultValue="5.00"
              required
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          {syncState.error && (
            <p className="text-xs text-red-600">{syncState.error}</p>
          )}
          {syncState.success && (
            <p className="text-xs text-emerald-600">{syncState.success}</p>
          )}
          <button
            type="submit"
            disabled={syncPending}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {syncPending
              ? "Buscando jogos..."
              : "Importar jogos da Copa 2026"}
          </button>
        </form>
      </section>

      {/* Create Match */}
      <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-bold text-emerald-950">
          Nova partida (manual)
        </h2>
        <form action={createAction} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Mandante
              </label>
              <input
                name="home_team"
                defaultValue="Brasil"
                required
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Visitante
              </label>
              <input
                name="away_team"
                placeholder="Adversário"
                required
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Data e hora
              </label>
              <input
                name="match_date"
                type="datetime-local"
                required
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Valor (R$)
              </label>
              <input
                name="cost_brl"
                type="number"
                step="0.01"
                min="1"
                defaultValue="5.00"
                required
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>
          {createState.error && (
            <p className="text-xs text-red-600">{createState.error}</p>
          )}
          {createState.success && (
            <p className="text-xs text-emerald-600">{createState.success}</p>
          )}
          <button
            type="submit"
            disabled={createPending}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {createPending ? "Criando..." : "Adicionar partida"}
          </button>
        </form>
      </section>

      {/* Match list & status */}
      <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-bold text-emerald-950">
          Gerenciar partidas
        </h2>
        {matches.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma partida cadastrada.</p>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {formatTeamName(match.home_team)} vs{" "}
                      {formatTeamName(match.away_team)}
                    </p>
                    <p className="text-xs text-gray-500">
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
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        match.status === status
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-emerald-50"
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
      <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
        <h2 className="mb-1 text-base font-bold text-emerald-950">
          Controle de pagamentos
        </h2>
        <p className="mb-3 text-xs text-gray-500">
          Marque como pago para liberar os palpites de cada jogador.
        </p>

        {matches.length > 0 && (
          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="mb-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          >
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {formatTeamName(m.home_team)} vs {formatTeamName(m.away_team)}
              </option>
            ))}
          </select>
        )}

        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
          {users.map((user) => {
            const paid =
              paymentMap.get(paymentKey(user.id, selectedMatchId)) ?? false;
            return (
              <div
                key={user.id}
                className="flex items-center justify-between px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  {user.whatsapp && (
                    <p className="text-xs text-gray-400">{user.whatsapp}</p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={paymentPending || !selectedMatchId}
                  onClick={() =>
                    handlePaymentToggle(user.id, selectedMatchId, !paid)
                  }
                  className={`relative h-7 w-14 rounded-full transition ${
                    paid ? "bg-emerald-500" : "bg-gray-300"
                  } disabled:opacity-50`}
                  aria-label={`Pagamento de ${user.name}: ${paid ? "pago" : "pendente"}`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                      paid ? "left-7" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-medium uppercase text-gray-400">
          <span>Pendente</span>
          <span>Pago</span>
        </div>
      </section>

      {/* Result entry */}
      <section className="rounded-2xl border border-yellow-200 bg-gradient-to-b from-yellow-50 to-white p-4 shadow-sm">
        <h2 className="mb-1 text-base font-bold text-emerald-950">
          Lançar resultado
        </h2>
        <p className="mb-3 text-xs text-gray-500">
          Ao salvar o placar final, a pontuação de todos os palpites é
          calculada automaticamente.
        </p>

        <form action={finishAction} className="space-y-3">
          <select
            name="match_id"
            required
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          >
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
            <p className="text-xs text-gray-500">
              Partida selecionada nos pagamentos:{" "}
              <strong>
                {formatTeamName(selectedMatch.home_team)} vs{" "}
                {formatTeamName(selectedMatch.away_team)}
              </strong>
            </p>
          )}

          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <label className="mb-1 block text-xs text-gray-600">
                Mandante
              </label>
              <input
                name="home_score"
                type="number"
                min={0}
                max={20}
                required
                defaultValue={0}
                className="w-16 rounded-xl border border-gray-200 px-2 py-2 text-center text-lg font-bold"
              />
            </div>
            <span className="pt-5 text-gray-300">×</span>
            <div className="text-center">
              <label className="mb-1 block text-xs text-gray-600">
                Visitante
              </label>
              <input
                name="away_score"
                type="number"
                min={0}
                max={20}
                required
                defaultValue={0}
                className="w-16 rounded-xl border border-gray-200 px-2 py-2 text-center text-lg font-bold"
              />
            </div>
          </div>

          {finishState.error && (
            <p className="text-xs text-red-600">{finishState.error}</p>
          )}
          {finishState.success && (
            <p className="text-xs text-emerald-600">{finishState.success}</p>
          )}

          <button
            type="submit"
            disabled={finishPending}
            className="w-full rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 py-2.5 text-sm font-bold text-emerald-950 disabled:opacity-60"
          >
            {finishPending ? "Calculando..." : "Finalizar e calcular pontos"}
          </button>
        </form>
      </section>
    </div>
  );
}
