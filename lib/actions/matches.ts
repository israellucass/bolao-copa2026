"use server";

import { enrichMatchesWithBetting } from "../betting";
import { requireCompleteUser } from "../auth";
import { getMatchPrizeSettlementsMap } from "../match-prizes";
import { getPredictionLogsMap } from "../prediction-log";
import { buildPaymentBlockMessages } from "../payment-enforcement";
import { supabase } from "../supabase";
import type { MatchWithMeta } from "../types";

export async function getMatchesForUser(): Promise<MatchWithMeta[]> {
  const user = await requireCompleteUser();

  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .order("match_date", { ascending: true });

  if (error || !matches) return [];

  const matchIds = matches.map((m) => m.id);

  const [{ data: payments }, { data: predictions }] = await Promise.all([
    supabase
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .in("match_id", matchIds),
    supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id)
      .in("match_id", matchIds),
  ]);

  const paymentMap = new Map(
    (payments ?? []).map((p) => [p.match_id, p.paid])
  );
  const predictionMap = new Map(
    (predictions ?? []).map((p) => [p.match_id, p])
  );

  const finishedMatches = matches.filter((m) => m.status === "finished");
  const [settlementsMap, logsMap] = await Promise.all([
    getMatchPrizeSettlementsMap(finishedMatches),
    getPredictionLogsMap(matchIds),
  ]);

  const withMeta = matches.map((match) => ({
    ...match,
    payment_status: (paymentMap.get(match.id) ? "paid" : "pending") as
      | "paid"
      | "pending",
    prediction: predictionMap.get(match.id) ?? null,
    prize_settlement: settlementsMap.get(match.id) ?? null,
    prediction_log: logsMap.get(match.id) ?? [],
  }));

  const paymentBlockMessages = buildPaymentBlockMessages({
    userId: user.id,
    matches,
    settlements: settlementsMap,
    paidByMatchId: new Map(
      (payments ?? []).map((p) => [p.match_id, p.paid])
    ),
    predictedMatchIds: new Set(
      (predictions ?? []).map((p) => p.match_id)
    ),
  });

  return enrichMatchesWithBetting(withMeta, paymentBlockMessages);
}
