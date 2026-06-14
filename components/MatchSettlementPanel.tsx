import { CopyPixButton } from "@/components/CopyPixButton";
import { formatCurrencyBRL } from "@/lib/format";
import { theme } from "@/lib/theme";
import type { MatchPrizeSettlement } from "@/lib/types";

interface MatchSettlementPanelProps {
  settlement: MatchPrizeSettlement;
  currentUserId: string;
  variant?: "full" | "winner";
}

export function MatchSettlementPanel({
  settlement,
  currentUserId,
  variant = "full",
}: MatchSettlementPanelProps) {
  const {
    match_pot,
    carry_in,
    total_pot,
    winner_count,
    prize_per_winner,
    winners,
    losers,
  } = settlement;

  const currentLoser = losers.find((l) => l.user_id === currentUserId);
  const currentWinner = winners.find((w) => w.user_id === currentUserId);

  const winnerTitle =
    winner_count === 1
      ? "Vencedor da rodada"
      : `Vencedores empatados (${winner_count})`;

  if (variant === "winner" && currentWinner) {
    return (
      <div className="space-y-3 rounded-xl border border-lime-800/50 bg-lime-950/30 px-4 py-4">
        <p className="text-sm font-bold uppercase tracking-wide text-lime-400">
          {winnerTitle}
        </p>
        <p className="text-base font-semibold text-amber-50">
          Parabéns! Você recebe{" "}
          <span className="text-lime-400">
            {formatCurrencyBRL(currentWinner.prize_amount)}
          </span>{" "}
          nesta rodada ({currentWinner.points} pts).
        </p>
        <div className="space-y-1 text-sm text-stone-300">
          <p>
            Pote total:{" "}
            <span className="font-semibold text-amber-100">
              {formatCurrencyBRL(total_pot)}
            </span>
          </p>
          {winner_count > 1 && (
            <p className="text-xs text-stone-400">
              Dividido entre {winner_count} vencedores.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-stone-800 bg-stone-950/50 px-4 py-3">
        <p className="text-sm font-bold uppercase tracking-wide text-stone-400">
          Pote da rodada
        </p>
        <div className="mt-2 space-y-1 text-sm text-stone-300">
          <p>
            Apostas desta partida:{" "}
            <span className="font-semibold text-amber-100">
              {formatCurrencyBRL(match_pot)}
            </span>
          </p>
          {carry_in > 0 && (
            <p>
              Acumulado de rodadas anteriores:{" "}
              <span className="font-semibold text-amber-100">
                {formatCurrencyBRL(carry_in)}
              </span>
            </p>
          )}
          <p className="text-base font-bold text-lime-400">
            Total do prêmio: {formatCurrencyBRL(total_pot)}
          </p>
          {winner_count > 1 && (
            <p className="text-xs text-stone-400">
              Dividido entre {winner_count} vencedores:{" "}
              {formatCurrencyBRL(prize_per_winner)} cada
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-lime-800/50 bg-lime-950/30 px-4 py-3">
        <p className="text-sm font-bold uppercase tracking-wide text-lime-400">
          {winnerTitle}
        </p>
        {winners.map((winner) => (
          <div
            key={winner.user_id}
            className="rounded-lg border border-stone-800 bg-stone-950/60 px-3 py-3"
          >
            <p className="font-semibold text-amber-50">
              {winner.name}
              {winner.user_id === currentUserId && (
                <span className="ml-1 text-xs font-normal text-lime-400">
                  (você)
                </span>
              )}
              <span className="mt-0.5 block text-sm font-medium text-lime-400 sm:mt-0 sm:ml-2 sm:inline">
                {winner.points} pts · Prêmio{" "}
                {formatCurrencyBRL(winner.prize_amount)}
              </span>
            </p>
            {winner.pix_key ? (
              <div className="mt-3 flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
                    Chave Pix
                  </p>
                  <p className="mt-0.5 break-all text-sm font-medium text-amber-50">
                    {winner.pix_key}
                  </p>
                </div>
                <CopyPixButton pixKey={winner.pix_key} />
              </div>
            ) : (
              <p className="mt-2 text-sm text-stone-500">
                Chave Pix não cadastrada — peça ao vencedor no grupo.
              </p>
            )}
          </div>
        ))}
      </div>

      {losers.length > 0 && (
        <div className="space-y-2 rounded-xl border border-amber-900/50 bg-amber-950/20 px-4 py-3">
          <p className="text-sm font-bold uppercase tracking-wide text-amber-300">
            Quem deve pagar
          </p>
          <p className="text-sm text-stone-300">
            Cada jogador abaixo envia {formatCurrencyBRL(settlement.bet_amount_brl)}{" "}
            via Pix ao(s) vencedor(es).
          </p>
          <ul className="divide-y divide-stone-800/80 rounded-lg border border-stone-800 bg-stone-950/40">
            {losers.map((loser) => (
              <li
                key={loser.user_id}
                className={`flex items-center justify-between gap-3 px-3 py-3 ${
                  loser.user_id === currentUserId
                    ? "bg-amber-950/30 ring-1 ring-inset ring-amber-800/40"
                    : ""
                }`}
              >
                <span className="min-w-0 truncate text-sm font-semibold text-amber-100">
                  {loser.name}
                  {loser.user_id === currentUserId && (
                    <span className="ml-1 text-xs font-normal text-amber-300">
                      (você)
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-base font-bold text-amber-200">
                  {formatCurrencyBRL(loser.amount_due)}
                </span>
              </li>
            ))}
          </ul>
          {currentLoser && currentLoser.payments.length > 1 && (
            <div className="rounded-lg border border-stone-800 bg-stone-950/50 px-3 py-2 text-sm text-stone-300">
              <p className="font-medium text-amber-100">Seu pagamento (você):</p>
              <ul className="mt-1 space-y-0.5">
                {currentLoser.payments.map((p) => (
                  <li key={p.winner_id}>
                    {formatCurrencyBRL(p.amount)} para {p.winner_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {currentWinner && (
        <p className="rounded-lg border border-lime-900/40 bg-lime-950/20 px-3 py-2 text-center text-sm text-lime-300">
          Parabéns! Você recebe {formatCurrencyBRL(currentWinner.prize_amount)}{" "}
          nesta rodada.
        </p>
      )}

      {currentLoser && (
        <p className="rounded-lg border border-amber-900/40 bg-amber-950/30 px-3 py-2 text-center text-sm font-semibold text-amber-200">
          Você deve {formatCurrencyBRL(settlement.bet_amount_brl)} via Pix ao(s)
          vencedor(es).
        </p>
      )}
    </div>
  );
}
