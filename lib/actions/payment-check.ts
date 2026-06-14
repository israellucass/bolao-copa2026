"use server";

import { getMatchPrizeSettlementsMap } from "../match-prizes";
import { buildPaymentBlockMessages } from "../payment-enforcement";
import { supabase } from "../supabase";

export async function checkPaymentBlockForBet(
  userId: string,
  targetMatchId: string
): Promise<{ message: string } | null> {
  const [{ data: matches }, { data: payments }, { data: predictions }] =
    await Promise.all([
      supabase.from("matches").select("*").order("match_date", { ascending: true }),
      supabase.from("payments").select("match_id, paid").eq("user_id", userId),
      supabase
        .from("predictions")
        .select("match_id")
        .eq("user_id", userId),
    ]);

  if (!matches?.length) return null;

  const target = matches.find((m) => m.id === targetMatchId);
  if (!target || target.status === "finished") return null;

  const finishedMatches = matches.filter((m) => m.status === "finished");
  const settlements = await getMatchPrizeSettlementsMap(finishedMatches);

  const messages = buildPaymentBlockMessages({
    userId,
    matches,
    settlements,
    paidByMatchId: new Map(
      (payments ?? []).map((p) => [p.match_id, p.paid])
    ),
    predictedMatchIds: new Set((predictions ?? []).map((p) => p.match_id)),
  });

  const message = messages.get(targetMatchId);
  return message ? { message } : null;
}
