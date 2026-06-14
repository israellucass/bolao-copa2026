"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../auth";
import {
  createPaymentsForAllUsers,
  recalculateMatchPoints,
} from "../match-helpers";
import { supabase } from "../supabase";
import { isBrasilTeamName, toPortugueseTeamName } from "../team-names";
import type { Match, User } from "../types";

export type AdminState = {
  error?: string;
  success?: string;
};

export async function getAdminData(): Promise<{
  matches: Match[];
  users: User[];
  payments: { user_id: string; match_id: string; paid: boolean }[];
}> {
  await requireAdmin();

  const [{ data: matches }, { data: users }, { data: payments }] =
    await Promise.all([
      supabase.from("matches").select("*").order("match_date", { ascending: true }),
      supabase
        .from("users")
        .select("id, name, whatsapp, pix_key, email, is_admin")
        .order("name"),
      supabase.from("payments").select("user_id, match_id, paid"),
    ]);

  return {
    matches: matches ?? [],
    users: users ?? [],
    payments: payments ?? [],
  };
}

export async function createMatch(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin();

  const homeTeam = toPortugueseTeamName(
    (formData.get("home_team") as string)?.trim()
  );
  const awayTeam = toPortugueseTeamName(
    (formData.get("away_team") as string)?.trim()
  );
  const matchDate = formData.get("match_date") as string;
  const costBrl = parseFloat(formData.get("cost_brl") as string);

  if (!homeTeam || !awayTeam) {
    return { error: "Informe os dois times." };
  }
  if (!matchDate) {
    return { error: "Informe data e hora da partida." };
  }
  if (Number.isNaN(costBrl) || costBrl <= 0) {
    return { error: "Valor da aposta inválido." };
  }

  const hasBrazil =
    isBrasilTeamName(homeTeam) || isBrasilTeamName(awayTeam);
  if (!hasBrazil) {
    return { error: "Uma das equipes deve ser o Brasil." };
  }

  const { data: match, error } = await supabase
    .from("matches")
    .insert({
      home_team: homeTeam,
      away_team: awayTeam,
      match_date: new Date(matchDate).toISOString(),
      cost_brl: costBrl,
      status: "open",
    })
    .select("id")
    .single();

  if (error || !match) {
    return { error: "Não foi possível criar a partida." };
  }

  await createPaymentsForAllUsers(match.id);

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: "Partida criada!" };
}

export async function updateMatchStatus(
  matchId: string,
  status: "open" | "closed"
): Promise<AdminState> {
  await requireAdmin();

  const { error } = await supabase
    .from("matches")
    .update({ status })
    .eq("id", matchId);

  if (error) return { error: "Não foi possível atualizar o status." };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: "Status atualizado." };
}

export async function togglePayment(
  userId: string,
  matchId: string,
  paid: boolean
): Promise<AdminState> {
  await requireAdmin();

  const { data: existing } = await supabase
    .from("payments")
    .select("id")
    .eq("user_id", userId)
    .eq("match_id", matchId)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("payments").update({ paid }).eq("id", existing.id)
    : await supabase
        .from("payments")
        .insert({ user_id: userId, match_id: matchId, paid });

  if (error) return { error: "Não foi possível atualizar o pagamento." };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: "Pagamento atualizado." };
}

export async function finishMatchWithScore(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin();

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
    return { error: "Placar final inválido (0–20)." };
  }

  const { data: existingMatch } = await supabase
    .from("matches")
    .select("finished_at")
    .eq("id", matchId)
    .single();

  const { error: matchError } = await supabase
    .from("matches")
    .update({
      status: "finished",
      home_score: homeScore,
      away_score: awayScore,
      finished_at: existingMatch?.finished_at ?? new Date().toISOString(),
    })
    .eq("id", matchId);

  if (matchError) {
    return { error: "Não foi possível salvar o resultado." };
  }

  await recalculateMatchPoints(matchId, homeScore, awayScore);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/ranking");
  return { success: "Resultado salvo! Pontuação e vencedor(es) atualizados." };
}
