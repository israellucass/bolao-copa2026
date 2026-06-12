-- Histórico de palpites (timeline pública por partida)
create table if not exists public.prediction_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  home_score int not null check (home_score >= 0),
  away_score int not null check (away_score >= 0),
  action text not null check (action in ('created', 'updated')),
  created_at timestamptz not null default now()
);

create index if not exists idx_prediction_log_match_created
  on public.prediction_log (match_id, created_at desc);

alter table public.prediction_log enable row level security;

drop policy if exists "Allow all for anon" on public.prediction_log;
create policy "Allow all for anon" on public.prediction_log
  for all using (true) with check (true);

-- Registrar palpites já existentes como entrada inicial
insert into public.prediction_log (user_id, match_id, home_score, away_score, action, created_at)
select
  user_id,
  match_id,
  home_score,
  away_score,
  'created',
  coalesce(updated_at, created_at)
from public.predictions
where not exists (
  select 1 from public.prediction_log pl
  where pl.user_id = predictions.user_id and pl.match_id = predictions.match_id
);
