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

export type BetLockReason =
  | "match_closed"
  | "match_finished"
  | "match_started"
  | "not_next_match";

export interface MatchWithMeta extends Match {
  payment_status: "pending" | "paid";
  prediction: Prediction | null;
  can_bet: boolean;
  lock_reason: BetLockReason | null;
  winners: MatchWinner[];
}

export interface RankingEntry {
  rank: number;
  user_id: string;
  name: string;
  total_points: number;
}
