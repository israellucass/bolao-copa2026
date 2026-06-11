export type MatchStatus = "open" | "closed" | "finished";
export type PaymentStatus = "pending" | "paid";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          whatsapp: string | null;
          pix_key: string | null;
          email: string | null;
          password_hash: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          whatsapp?: string | null;
          pix_key?: string | null;
          email?: string | null;
          password_hash?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          whatsapp?: string | null;
          pix_key?: string | null;
          email?: string | null;
          password_hash?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          home_team: string;
          away_team: string;
          match_date: string;
          cost_brl: number;
          status: MatchStatus;
          home_score: number | null;
          away_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_team: string;
          away_team: string;
          match_date: string;
          cost_brl?: number;
          status?: MatchStatus;
          home_score?: number | null;
          away_score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_team?: string;
          away_team?: string;
          match_date?: string;
          cost_brl?: number;
          status?: MatchStatus;
          home_score?: number | null;
          away_score?: number | null;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          paid: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          match_id: string;
          paid?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          match_id?: string;
          paid?: boolean;
          created_at?: string;
        };
      };
      prediction_log: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          home_score: number;
          away_score: number;
          action: "created" | "updated";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          match_id: string;
          home_score: number;
          away_score: number;
          action: "created" | "updated";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          match_id?: string;
          home_score?: number;
          away_score?: number;
          action?: "created" | "updated";
          created_at?: string;
        };
      };
      predictions: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          home_score: number;
          away_score: number;
          points: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          match_id: string;
          home_score: number;
          away_score: number;
          points?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          match_id?: string;
          home_score?: number;
          away_score?: number;
          points?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
