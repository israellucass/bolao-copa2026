-- Bolão Copa 2026 — Supabase schema
-- Run this in the Supabase SQL Editor

create extension if not exists "pgcrypto";

-- Users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text,
  whatsapp text unique,
  email text unique,
  password_hash text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  constraint users_login_identifier check (whatsapp is not null or email is not null)
);

-- Matches (Brazil-focused: one side should be "Brasil")
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  home_team text not null,
  away_team text not null,
  match_date timestamptz not null,
  cost_brl numeric(10, 2) not null default 5.00,
  status text not null default 'open' check (status in ('open', 'closed', 'finished')),
  home_score int,
  away_score int,
  external_fixture_id int unique,
  created_at timestamptz not null default now()
);

-- Per-user payment per match
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  paid boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, match_id)
);

-- Predictions (palpites)
create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  home_score int not null check (home_score >= 0),
  away_score int not null check (away_score >= 0),
  points int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, match_id)
);

create index if not exists idx_matches_date on public.matches (match_date);
create index if not exists idx_predictions_user on public.predictions (user_id);
create index if not exists idx_predictions_match on public.predictions (match_id);
create index if not exists idx_payments_match on public.payments (match_id);

-- RLS: disabled for simplicity with anon key in a trusted friends group.
-- For production, enable RLS and use service role on the server.
alter table public.users enable row level security;
alter table public.matches enable row level security;
alter table public.payments enable row level security;
alter table public.predictions enable row level security;

create policy "Allow all for anon" on public.users for all using (true) with check (true);
create policy "Allow all for anon" on public.matches for all using (true) with check (true);
create policy "Allow all for anon" on public.payments for all using (true) with check (true);
create policy "Allow all for anon" on public.predictions for all using (true) with check (true);

-- Mark your admin user after first login:
-- update public.users set is_admin = true where whatsapp = '5511999999999';
