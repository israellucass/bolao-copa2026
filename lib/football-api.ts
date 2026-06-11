/**
 * football-data.org — Brazil World Cup 2026 fixtures.
 * Free plan: https://www.football-data.org/
 */

import { isBrasilTeamName, toPortugueseTeamName } from "./team-names";

const API_BASE = "https://api.football-data.org/v4";
const WORLD_CUP_CODE = "WC";
const WORLD_CUP_SEASON = 2026;

export interface ExternalFixture {
  externalId: number;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  statusShort: string;
  homeScore: number | null;
  awayScore: number | null;
  round: string | null;
}

interface FootballDataTeam {
  id: number | null;
  name: string | null;
  shortName: string | null;
  tla: string | null;
}

interface FootballDataMatch {
  id: number;
  utcDate: string;
  status: string;
  stage: string | null;
  homeTeam: FootballDataTeam | null;
  awayTeam: FootballDataTeam | null;
  score?: {
    fullTime?: { home: number | null; away: number | null };
  };
}

interface FootballDataMatchesResponse {
  matches?: FootballDataMatch[];
  message?: string;
  errorCode?: number;
}

function teamLabel(team: FootballDataTeam | null | undefined): string {
  if (!team) return "A definir";
  return toPortugueseTeamName(team.shortName || team.name, team.tla);
}

function isBrazilTeam(team: FootballDataTeam | null | undefined): boolean {
  if (!team) return false;
  if (team.tla === "BRA") return true;
  if (team.name && isBrasilTeamName(team.name)) return true;
  if (team.shortName && isBrasilTeamName(team.shortName)) return true;
  return false;
}

export async function fetchBrazilWorldCupFixtures(): Promise<ExternalFixture[]> {
  const apiToken = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiToken) {
    throw new Error(
      "FOOTBALL_DATA_API_KEY não configurada. Crie uma conta grátis em football-data.org e cole o token no .env.local."
    );
  }

  const url = new URL(
    `${API_BASE}/competitions/${WORLD_CUP_CODE}/matches`
  );
  url.searchParams.set("season", String(WORLD_CUP_SEASON));

  const res = await fetch(url.toString(), {
    headers: { "X-Auth-Token": apiToken },
    next: { revalidate: 3600 },
  });

  if (res.status === 403) {
    throw new Error(
      "Acesso negado pela football-data.org. Verifique seu token ou se a Copa 2026 está no seu plano."
    );
  }

  if (res.status === 429) {
    throw new Error(
      "Limite de requisições atingido. Aguarde 1 minuto e tente novamente."
    );
  }

  if (!res.ok) {
    throw new Error(
      `football-data.org retornou erro ${res.status}. Tente mais tarde.`
    );
  }

  const json = (await res.json()) as FootballDataMatchesResponse;

  if (json.message) {
    throw new Error(json.message);
  }

  return (json.matches ?? [])
    .filter(
      (match) => isBrazilTeam(match.homeTeam) || isBrazilTeam(match.awayTeam)
    )
    .filter((match) => match.homeTeam && match.awayTeam)
    .map((match) => ({
      externalId: match.id,
      homeTeam: teamLabel(match.homeTeam),
      awayTeam: teamLabel(match.awayTeam),
      matchDate: match.utcDate,
      statusShort: match.status,
      homeScore: match.score?.fullTime?.home ?? null,
      awayScore: match.score?.fullTime?.away ?? null,
      round: match.stage ?? null,
    }))
    .sort(
      (a, b) =>
        new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
    );
}
