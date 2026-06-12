import assert from "node:assert/strict";
import test from "node:test";
import { buildMatchTimelineRows } from "./prediction-timeline";
import type { PredictionLogEntry } from "./types";

function entry(
  partial: Omit<PredictionLogEntry, "match_id"> & { match_id?: string }
): PredictionLogEntry {
  return {
    match_id: "match-1",
    ...partial,
  };
}

test("buildMatchTimelineRows — uma linha por jogador, palpite mais recente", () => {
  const rows = buildMatchTimelineRows([
    entry({
      id: "1",
      user_id: "u1",
      user_name: "Hudson",
      home_score: 2,
      away_score: 0,
      action: "created",
      created_at: "2026-06-11T10:00:00.000Z",
    }),
    entry({
      id: "2",
      user_id: "u2",
      user_name: "Lucas",
      home_score: 1,
      away_score: 0,
      action: "created",
      created_at: "2026-06-11T10:05:00.000Z",
    }),
    entry({
      id: "3",
      user_id: "u1",
      user_name: "Hudson",
      home_score: 3,
      away_score: 0,
      action: "updated",
      created_at: "2026-06-11T10:10:00.000Z",
    }),
  ]);

  assert.equal(rows.length, 2);
  assert.equal(rows[0].user_name, "Hudson");
  assert.equal(rows[0].home_score, 3);
  assert.equal(rows[1].user_name, "Lucas");
});
