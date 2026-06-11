type Outcome = "home" | "away" | "draw";

function getOutcome(home: number, away: number): Outcome {
  if (home > away) return "home";
  if (home < away) return "away";
  return "draw";
}

/**
 * Calculates points for a single prediction against the final match result.
 *
 * Rules:
 * - Exact score: 25 pts
 * - Correct outcome + correct goal difference (wrong score): 15 pts
 * - Correct outcome only: 10 pts
 * - Correct draw (wrong score): 12 pts
 * - Goal bonus: +2 per team with exact goals guessed (independent of outcome)
 */
export function calculatePredictionPoints(
  betHome: number,
  betAway: number,
  resultHome: number,
  resultAway: number
): number {
  let points = 0;

  const exactScore = betHome === resultHome && betAway === resultAway;
  const betOutcome = getOutcome(betHome, betAway);
  const resultOutcome = getOutcome(resultHome, resultAway);
  const betGoalDiff = betHome - betAway;
  const resultGoalDiff = resultHome - resultAway;

  if (exactScore) {
    points = 25;
  } else if (betOutcome === "draw" && resultOutcome === "draw") {
    points = 12;
  } else if (
    betOutcome === resultOutcome &&
    betGoalDiff === resultGoalDiff
  ) {
    points = 15;
  } else if (betOutcome === resultOutcome) {
    points = 10;
  }

  if (betHome === resultHome) points += 2;
  if (betAway === resultAway) points += 2;

  return points;
}
