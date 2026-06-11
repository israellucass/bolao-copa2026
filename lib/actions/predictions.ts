"use server";

import { revalidatePath } from "next/cache";
import {
  getBetEligibility,
  getBetLockMessage,
  getNextBettableMatchId,
} from "../betting";
import { requireCompleteUser } from "../auth";
import { supabase } from "../supabase";

export type PredictionState = {
  error?: string;
  success?: string;
};

export async function savePrediction(
  _prev: PredictionState,
  formData: FormData
): Promise<PredictionState> {
  const user = await requireCompleteUser();
  const matchId = formData.get("match_id") as string;
  const homeScore = parseInt(formData.get("home_score") as string, 10);
  const awayScore = parseInt(formData.get("away_score") as string, 10);

  if (!matchId) return { error: "Partida inválida." };
  if (
    Number.isNaN(homeScore) ||
    Number.isNaN(awayScore) ||
    homeScore < 0 ||
    awayScore < 0 ||
    homeScore > 20 ||
    awayScore > 20
  ) {
    return { error: "Placar inválido (0–20)." };
  }

  const [{ data: match }, { data: allMatches }] = await Promise.all([
    supabase.from("matches").select("*").eq("id", matchId).single(),
    supabase
      .from("matches")
      .select("id, match_date, status")
      .order("match_date", { ascending: true }),
  ]);

  if (!match) {
    return { error: "Partida não encontrada." };
  }

  const nextMatchId = getNextBettableMatchId(allMatches ?? []);
  const { canBet, lockReason } = getBetEligibility(match, nextMatchId);

  if (!canBet && lockReason) {
    return { error: getBetLockMessage(lockReason).replace("🔒 ", "") };
  }

  const { data: existing } = await supabase
    .from("predictions")
    .select("id")
    .eq("user_id", user.id)
    .eq("match_id", matchId)
    .maybeSingle();

  const payload = {
    home_score: homeScore,
    away_score: awayScore,
    updated_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await supabase
        .from("predictions")
        .update(payload)
        .eq("id", existing.id)
    : await supabase.from("predictions").insert({
        user_id: user.id,
        match_id: matchId,
        ...payload,
      });

  if (error) {
    return { error: "Não foi possível salvar o palpite." };
  }

  revalidatePath("/");
  return { success: "Palpite salvo com sucesso!" };
}
