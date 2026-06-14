import { computeSettlement } from "./match-prizes";

function assertClose(actual: number, expected: number, label: string) {
  if (Math.abs(actual - expected) > 0.01) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

const COST_BRL = 4;

const participants13 = Array.from({ length: 13 }, (_, i) => ({
  user_id: `u${i}`,
  name: `P${i}`,
  pix_key: null,
  points: i === 0 ? 25 : 10,
}));

const oneWinner = computeSettlement(COST_BRL, 0, participants13).settlement!;
assertClose(oneWinner.total_pot, 52, "single winner total pot");
assertClose(oneWinner.prize_per_winner, 52, "single winner prize");
assertClose(oneWinner.losers[0].amount_due, COST_BRL, "single winner loser due");

const tiedWinners = computeSettlement(COST_BRL, 0, [
  { user_id: "w1", name: "A", pix_key: null, points: 25 },
  { user_id: "w2", name: "B", pix_key: null, points: 25 },
  ...Array.from({ length: 11 }, (_, i) => ({
    user_id: `l${i}`,
    name: `L${i}`,
    pix_key: null,
    points: 10,
  })),
]).settlement!;
assertClose(tiedWinners.prize_per_winner, 26, "tied winners prize each");
assertClose(tiedWinners.losers[0].amount_due, COST_BRL, "tied winners loser due");
assertClose(
  tiedWinners.losers[0].payments[0].amount,
  COST_BRL / 2,
  "tied winners split per winner"
);

const carryOver = computeSettlement(COST_BRL, 40, participants13).settlement!;
assertClose(carryOver.total_pot, 92, "carry-in total pot");
assertClose(carryOver.carry_in, 40, "carry-in amount");
assertClose(carryOver.losers[0].amount_due, COST_BRL, "carry-in loser still pays bet");

const noWinner = computeSettlement(COST_BRL, 0, [
  { user_id: "u1", name: "A", pix_key: null, points: 0 },
  { user_id: "u2", name: "B", pix_key: null, points: 0 },
]);
if (noWinner.settlement !== null || noWinner.nextCarry !== 8) {
  throw new Error("no winner should roll pot forward");
}

console.log("All match-prizes tests passed.");
