"use server";

import { enrichMatchesWithBetting } from "../betting";
import { requireUser } from "../auth";
import { getMatchWinnersMap } from "../match-winners";
import { supabase } from "../supabase";
import type { MatchWithMeta } from "../types";

export async function getMatchesForUser(): Promise<MatchWithMeta[]> {
  const user = await requireUser();

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

  const finishedIds = matches
    .filter((m) => m.status === "finished")
    .map((m) => m.id);
  const winnersMap = await getMatchWinnersMap(finishedIds);

  const withMeta = matches.map((match) => ({
    ...match,
    payment_status: (paymentMap.get(match.id) ? "paid" : "pending") as
      | "paid"
      | "pending",
    prediction: predictionMap.get(match.id) ?? null,
    winners: winnersMap.get(match.id) ?? [],
  }));

  return enrichMatchesWithBetting(withMeta);
}
