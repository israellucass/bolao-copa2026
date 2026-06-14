import { CopyPixButton } from "@/components/CopyPixButton";
import { formatCurrencyBRL } from "@/lib/format";
import { userLoserEntry } from "@/lib/match-settlement";
import type { MatchPrizeSettlement } from "@/lib/types";

interface MatchWinnersHighlightProps {
  settlement: MatchPrizeSettlement;
  currentUserId: string;
}

export function MatchWinnersHighlight({
  settlement,
  currentUserId,
}: MatchWinnersHighlightProps) {
  const { winners, winner_count } = settlement;
  const loserEntry = userLoserEntry(settlement, currentUserId);

  const title =
    winner_count === 1 ? "Vencedor da rodada" : `${winner_count} vencedores`;

  return (
    <div className="space-y-3 rounded-xl border border-amber-700/60 bg-gradient-to-b from-amber-950/50 to-stone-950/80 px-4 py-4 ring-1 ring-amber-600/30">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
          {title}
        </p>
        {loserEntry && (
          <p className="mt-1 text-sm font-semibold text-amber-100">
            Envie {formatCurrencyBRL(settlement.bet_amount_brl)} via Pix
            <span className="font-normal text-stone-400">
              {" "}
              (valor da aposta)
            </span>
          </p>
        )}
      </div>

      <ul className="space-y-2">
        {winners.map((winner) => (
          <li
            key={winner.user_id}
            className="rounded-lg border border-stone-800 bg-stone-950/70 px-3 py-3"
          >
            <p className="font-bold text-amber-50">
              {winner.name}
              <span className="ml-2 text-sm font-semibold text-lime-400">
                {formatCurrencyBRL(winner.prize_amount)}
              </span>
            </p>
            {winner.pix_key ? (
              <div className="mt-2 flex items-start gap-2">
                <p className="min-w-0 flex-1 break-all text-sm text-stone-300">
                  <span className="sr-only">Chave Pix de {winner.name}</span>
                  {winner.pix_key}
                </p>
                <CopyPixButton pixKey={winner.pix_key} />
              </div>
            ) : (
              <p className="mt-1.5 text-sm text-stone-500">
                Pix não cadastrado — combine no grupo.
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
