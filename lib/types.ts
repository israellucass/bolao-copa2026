import type { MatchStatus } from "./database.types";

export interface User {
  id: string;
  name: string | null;
  whatsapp: string | null;
  pix_key: string | null;
  email: string | null;
  is_admin: boolean;
}

export interface MatchWinner {
  user_id: string;
  name: string;
  pix_key: string | null;
  points: number;
  prize_amount: number;
}

export interface MatchLoserDebt {
  user_id: string;
  name: string;
  amount_due: number;
  payments: {
    winner_id: string;
    winner_name: string;
    amount: number;
  }[];
}

export interface MatchPrizeSettlement {
  match_pot: number;
  carry_in: number;
  total_pot: number;
  participant_count: number;
  winner_count: number;
  prize_per_winner: number;
  winners: MatchWinner[];
  losers: MatchLoserDebt[];
}

export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  match_date: string;
  cost_brl: number;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
}

export interface Prediction {
  id: string;
  user_id: string;
  match_id: string;
  home_score: number;
  away_score: number;
  points: number | null;
}

export type PredictionLogAction = "created" | "updated";

export interface PredictionLogEntry {
  id: string;
  user_id: string;
  user_name: string;
  match_id: string;
  home_score: number;
  away_score: number;
  action: PredictionLogAction;
  created_at: string;
}

export type BetLockReason =
  | "match_closed"
  | "match_finished"
  | "match_started";

export interface MatchWithMeta extends Match {
  payment_status: "pending" | "paid";
  prediction: Prediction | null;
  can_bet: boolean;
  lock_reason: BetLockReason | null;
  prize_settlement: MatchPrizeSettlement | null;
  prediction_log: PredictionLogEntry[];
}

export interface RankingEntry {
  rank: number;
  user_id: string;
  name: string;
  total_points: number;
}
