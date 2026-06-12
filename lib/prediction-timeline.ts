import type { PredictionLogEntry } from "./types";

/** Uma linha por jogador — palpite mais recente, ordenado por quem palpitou primeiro. */
export function buildMatchTimelineRows(
  entries: PredictionLogEntry[]
): PredictionLogEntry[] {
  const firstAt = new Map<string, number>();
  const latestByUser = new Map<string, PredictionLogEntry>();

  for (const entry of entries) {
    const at = new Date(entry.created_at).getTime();

    if (!firstAt.has(entry.user_id)) {
      firstAt.set(entry.user_id, at);
    }

    const existing = latestByUser.get(entry.user_id);
    if (!existing || at > new Date(existing.created_at).getTime()) {
      latestByUser.set(entry.user_id, entry);
    }
  }

  return [...latestByUser.values()].sort(
    (a, b) =>
      (firstAt.get(a.user_id) ?? 0) - (firstAt.get(b.user_id) ?? 0)
  );
}
