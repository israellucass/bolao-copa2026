import { CopyPixButton } from "@/components/CopyPixButton";
import { theme } from "@/lib/theme";
import type { MatchWinner } from "@/lib/types";

interface MatchWinnerBannerProps {
  winners: MatchWinner[];
}

export function MatchWinnerBanner({ winners }: MatchWinnerBannerProps) {
  if (winners.length === 0) return null;

  const title =
    winners.length === 1
      ? "Vencedor da rodada"
      : `Vencedores empatados (${winners.length})`;

  return (
    <div className="space-y-2 rounded-xl border border-lime-800/50 bg-lime-950/30 px-3 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-lime-400">
        {title}
      </p>
      {winners.map((winner) => (
        <div
          key={winner.user_id}
          className="rounded-lg border border-stone-800 bg-stone-950/60 px-3 py-2.5"
        >
          <p className="font-semibold text-amber-100">
            {winner.name}{" "}
            <span className="text-sm font-medium text-lime-400">
              · {winner.points} pts
            </span>
          </p>
          {winner.pix_key ? (
            <div className="mt-2 flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className={theme.labelInline}>Pix para pagamento</p>
                <p className="break-all text-sm font-medium text-amber-50">
                  {winner.pix_key}
                </p>
              </div>
              <CopyPixButton pixKey={winner.pix_key} />
            </div>
          ) : (
            <p className="mt-1 text-xs text-stone-500">
              Chave Pix não cadastrada — peça ao vencedor no grupo.
            </p>
          )}
        </div>
      ))}
      <p className="text-xs text-stone-500">
        Envie o valor da aposta via Pix ao vencedor desta partida.
      </p>
    </div>
  );
}
