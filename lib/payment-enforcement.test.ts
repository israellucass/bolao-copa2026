import assert from "node:assert/strict";
import test from "node:test";
import {
  PAYMENT_GRACE_MS,
  buildPaymentBlockMessages,
  formatCaloteiroMessage,
  formatElapsedHhMm,
  formatWinnerNamesPt,
  findOverdueUnpaidDebts,
} from "./payment-enforcement";
import type { MatchPrizeSettlement } from "./types";

const settlement: MatchPrizeSettlement = {
  match_pot: 48,
  carry_in: 0,
  total_pot: 48,
  participant_count: 12,
  winner_count: 1,
  prize_per_winner: 48,
  bet_amount_brl: 4,
  winners: [{ user_id: "w1", name: "Hudson", pix_key: null, points: 25, prize_amount: 48 }],
  losers: [
    {
      user_id: "u2",
      name: "Lucas",
      amount_due: 4,
      payments: [{ winner_id: "w1", winner_name: "Hudson", amount: 4 }],
    },
  ],
};

test("formatElapsedHhMm", () => {
  assert.equal(formatElapsedHhMm(90 * 60_000), "01h30min");
});

test("formatWinnerNamesPt", () => {
  assert.equal(formatWinnerNamesPt(["Hudson"]), "Hudson");
  assert.equal(formatWinnerNamesPt(["Hudson", "Lucas"]), "Hudson e Lucas");
});

test("blocks next match after grace when loser unpaid", () => {
  const now = Date.parse("2026-06-15T12:00:00.000Z");
  const debts = findOverdueUnpaidDebts({
    userId: "u2",
    matches: [
      {
        id: "m1",
        match_date: "2026-06-10T20:00:00.000Z",
        status: "finished",
        home_score: 2,
        away_score: 0,
        finished_at: "2026-06-10T22:00:00.000Z",
      },
      {
        id: "m2",
        match_date: "2026-06-20T20:00:00.000Z",
        status: "open",
        home_score: null,
        away_score: null,
      },
    ],
    settlements: new Map([["m1", settlement]]),
    paidByMatchId: new Map([["m1", false]]),
    predictedMatchIds: new Set(["m1"]),
    now,
  });

  assert.equal(debts.length, 1);
  assert.match(debts[0].message, /Hudson/);
  assert.match(debts[0].message, /caloteiro/);

  const blocks = buildPaymentBlockMessages({
    userId: "u2",
    matches: [
      {
        id: "m1",
        match_date: "2026-06-10T20:00:00.000Z",
        status: "finished",
        home_score: 2,
        away_score: 0,
        finished_at: "2026-06-10T22:00:00.000Z",
      },
      {
        id: "m2",
        match_date: "2026-06-20T20:00:00.000Z",
        status: "open",
        home_score: null,
        away_score: null,
      },
    ],
    settlements: new Map([["m1", settlement]]),
    paidByMatchId: new Map([["m1", false]]),
    predictedMatchIds: new Set(["m1"]),
    now,
  });

  assert.equal(blocks.get("m2"), debts[0].message);
});

test("no block within 24h grace", () => {
  const finishedAt = "2026-06-14T12:00:00.000Z";
  const now = Date.parse(finishedAt) + PAYMENT_GRACE_MS - 60_000;

  const debts = findOverdueUnpaidDebts({
    userId: "u2",
    matches: [
      {
        id: "m1",
        match_date: "2026-06-14T10:00:00.000Z",
        status: "finished",
        home_score: 1,
        away_score: 0,
        finished_at: finishedAt,
      },
    ],
    settlements: new Map([["m1", settlement]]),
    paidByMatchId: new Map([["m1", false]]),
    predictedMatchIds: new Set(["m1"]),
    now,
  });

  assert.equal(debts.length, 0);
});

test("winner and paid users not blocked", () => {
  const now = Date.parse("2026-06-15T12:00:00.000Z");

  const winnerDebts = findOverdueUnpaidDebts({
    userId: "w1",
    matches: [
      {
        id: "m1",
        match_date: "2026-06-10T20:00:00.000Z",
        status: "finished",
        home_score: 2,
        away_score: 0,
        finished_at: "2026-06-10T22:00:00.000Z",
      },
    ],
    settlements: new Map([["m1", settlement]]),
    paidByMatchId: new Map([["m1", false]]),
    predictedMatchIds: new Set(["m1"]),
    now,
  });
  assert.equal(winnerDebts.length, 0);

  const paidDebts = findOverdueUnpaidDebts({
    userId: "u2",
    matches: [
      {
        id: "m1",
        match_date: "2026-06-10T20:00:00.000Z",
        status: "finished",
        home_score: 2,
        away_score: 0,
        finished_at: "2026-06-10T22:00:00.000Z",
      },
    ],
    settlements: new Map([["m1", settlement]]),
    paidByMatchId: new Map([["m1", true]]),
    predictedMatchIds: new Set(["m1"]),
    now,
  });
  assert.equal(paidDebts.length, 0);
});

assert.match(
  formatCaloteiroMessage(["Hudson", "Lucas"], 25 * 60 * 60_000 + 30 * 60_000),
  /Pague Hudson e Lucas, caloteiro! Você está devendo há 25h30min/
);
