"use server";

import { supabase } from "../supabase";
import type { RankingEntry } from "../types";

export async function getRanking(): Promise<RankingEntry[]> {
  const [{ data: users }, { data: predictions }] = await Promise.all([
    supabase.from("users").select("id, name").order("name"),
    supabase.from("predictions").select("user_id, points"),
  ]);

  if (!users?.length) return [];

  const totals = new Map<string, number>();
  for (const user of users) {
    totals.set(user.id, 0);
  }

  for (const pred of predictions ?? []) {
    if (pred.points != null) {
      totals.set(pred.user_id, (totals.get(pred.user_id) ?? 0) + pred.points);
    }
  }

  const sorted = users
    .filter((user) => user.name?.trim() && user.name.trim().length >= 2)
    .map((user) => ({
      user_id: user.id,
      name: user.name!.trim(),
      total_points: totals.get(user.id) ?? 0,
    }))
    .sort((a, b) => b.total_points - a.total_points);

  return sorted.map((entry, index) => ({
    rank: index + 1,
    ...entry,
  }));
}
