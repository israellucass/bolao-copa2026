import { calculatePredictionPoints } from "./scoring";

function assertEqual(actual: number, expected: number, label: string) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

// Exact score: 25 + goal bonus (2+2) = 29
assertEqual(calculatePredictionPoints(2, 1, 2, 1), 29, "exact score");

// Correct outcome + GD: 15 (no per-team goal bonus)
assertEqual(calculatePredictionPoints(3, 1, 2, 0), 15, "outcome + GD");

// Correct outcome only: 10
assertEqual(calculatePredictionPoints(1, 0, 3, 1), 10, "outcome only");

// Correct draw wrong score: 12
assertEqual(calculatePredictionPoints(1, 1, 2, 2), 12, "draw");

// Wrong outcome, away goals exact: +2 bonus only
assertEqual(calculatePredictionPoints(0, 1, 2, 1), 2, "goal bonus only");

// Outcome only + home goal bonus: 10 + 2
assertEqual(calculatePredictionPoints(3, 0, 3, 2), 12, "outcome + home bonus");

console.log("All scoring tests passed.");
