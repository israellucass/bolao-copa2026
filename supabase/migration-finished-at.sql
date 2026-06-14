-- Momento em que o admin lançou o resultado (para prazo de pagamento)
alter table public.matches add column if not exists finished_at timestamptz;

update public.matches
set finished_at = match_date + interval '2 hours'
where status = 'finished'
  and finished_at is null
  and home_score is not null
  and away_score is not null;
