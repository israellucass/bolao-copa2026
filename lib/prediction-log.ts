import { supabase } from "./supabase";
import type { PredictionLogEntry } from "./types";

type LogRow = {
  id: string;
  user_id: string;
  match_id: string;
  home_score: number;
  away_score: number;
  action: "created" | "updated";
  created_at: string;
  users: { name: string | null } | { name: string | null }[] | null;
};

function resolveUserName(
  users: LogRow["users"]
): string {
  if (!users) return "Jogador";
  const user = Array.isArray(users) ? users[0] : users;
  return user?.name?.trim() || "Jogador";
}

export async function getPredictionLogsMap(
  matchIds: string[]
): Promise<Map<string, PredictionLogEntry[]>> {
  const result = new Map<string, PredictionLogEntry[]>();
  if (matchIds.length === 0) return result;

  const { data: rows } = await supabase
    .from("prediction_log")
    .select(
      "id, user_id, match_id, home_score, away_score, action, created_at, users(name)"
    )
    .in("match_id", matchIds)
    .order("created_at", { ascending: false });

  for (const row of (rows ?? []) as LogRow[]) {
    const entry: PredictionLogEntry = {
      id: row.id,
      user_id: row.user_id,
      user_name: resolveUserName(row.users),
      match_id: row.match_id,
      home_score: row.home_score,
      away_score: row.away_score,
      action: row.action,
      created_at: row.created_at,
    };
    const list = result.get(row.match_id) ?? [];
    list.push(entry);
    result.set(row.match_id, list);
  }

  return result;
}
