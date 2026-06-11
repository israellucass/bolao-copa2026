"use server";

import { revalidatePath } from "next/cache";
import { DEFAULT_BET_BRL } from "../constants";
import { requireAdmin } from "../auth";
import { fetchBrazilWorldCupFixtures } from "../football-api";
import {
  createPaymentsForAllUsers,
  mapApiStatusToMatch,
  recalculateMatchPoints,
} from "../match-helpers";
import { supabase } from "../supabase";
import type { AdminState } from "./admin";

export async function syncBrazilMatches(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin();

  const costBrl = parseFloat(
    (formData.get("cost_brl") as string) || String(DEFAULT_BET_BRL)
  );

  if (Number.isNaN(costBrl) || costBrl <= 0) {
    return { error: "Valor da aposta inválido." };
  }

  let fixtures;
  try {
    fixtures = await fetchBrazilWorldCupFixtures();
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Não foi possível buscar os jogos.",
    };
  }

  if (fixtures.length === 0) {
    return {
      error:
        "Nenhum jogo do Brasil na Copa 2026 encontrado. A agenda pode ainda não estar publicada na football-data.org.",
    };
  }

  const { data: existingMatches } = await supabase
    .from("matches")
    .select("external_fixture_id, home_team, away_team, match_date");

  const existingIds = new Set(
    (existingMatches ?? [])
      .map((m) => m.external_fixture_id)
      .filter((id): id is number => id != null)
  );

  const existingKeys = new Set(
    (existingMatches ?? []).map(
      (m) =>
        `${m.home_team}|${m.away_team}|${new Date(m.match_date).toISOString()}`
    )
  );

  let imported = 0;
  let skipped = 0;
  for (const fixture of fixtures) {
    if (existingIds.has(fixture.externalId)) {
      skipped++;
      continue;
    }

    const mapped = mapApiStatusToMatch(fixture.statusShort);
    if (!mapped) {
      skipped++;
      continue;
    }

    const matchKey = `${fixture.homeTeam}|${fixture.awayTeam}|${new Date(fixture.matchDate).toISOString()}`;
    if (existingKeys.has(matchKey)) {
      skipped++;
      continue;
    }

    const isFinished = mapped.status === "finished";
    const homeScore = isFinished ? fixture.homeScore : null;
    const awayScore = isFinished ? fixture.awayScore : null;

    const { data: match, error } = await supabase
      .from("matches")
      .insert({
        home_team: fixture.homeTeam,
        away_team: fixture.awayTeam,
        match_date: fixture.matchDate,
        cost_brl: costBrl,
        status: mapped.status,
        home_score: homeScore,
        away_score: awayScore,
        external_fixture_id: fixture.externalId,
      })
      .select("id")
      .single();

    if (error || !match) {
      continue;
    }

    await createPaymentsForAllUsers(match.id);

    if (
      isFinished &&
      homeScore != null &&
      awayScore != null
    ) {
      await recalculateMatchPoints(match.id, homeScore, awayScore);
    }

    existingIds.add(fixture.externalId);
    existingKeys.add(matchKey);
    imported++;
  }

  // Update dates/status for already-imported fixtures
  const { data: allDbMatches } = await supabase
    .from("matches")
    .select("id, external_fixture_id, status")
    .not("external_fixture_id", "is", null);

  for (const fixture of fixtures) {
    const dbMatch = allDbMatches?.find(
      (m) => m.external_fixture_id === fixture.externalId
    );
    if (!dbMatch || dbMatch.status === "finished") continue;

    const mapped = mapApiStatusToMatch(fixture.statusShort);
    if (!mapped) continue;

    const isFinished = mapped.status === "finished";
    const homeScore = isFinished ? fixture.homeScore : null;
    const awayScore = isFinished ? fixture.awayScore : null;

    await supabase
      .from("matches")
      .update({
        home_team: fixture.homeTeam,
        away_team: fixture.awayTeam,
        match_date: fixture.matchDate,
        status: mapped.status,
        home_score: homeScore,
        away_score: awayScore,
      })
      .eq("id", dbMatch.id);

    if (isFinished && homeScore != null && awayScore != null) {
      await recalculateMatchPoints(dbMatch.id, homeScore, awayScore);
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/ranking");

  if (imported === 0 && skipped === fixtures.length) {
    return {
      success: `Todos os ${fixtures.length} jogos do Brasil já estavam cadastrados.`,
    };
  }

  return {
    success: `Importação concluída: ${imported} novo(s), ${skipped} já existente(s) ou ignorado(s).`,
  };
}
