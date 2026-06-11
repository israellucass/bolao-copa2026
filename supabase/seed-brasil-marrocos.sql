-- Seed: jogadores e palpites — Brasil x Marrocos (primeiro jogo)
-- Já aplicado em 2026-06-11. Use apenas como referência ou reexecução manual.
-- match_id: ae940155-fadd-4246-b641-0a3d3605fd03

insert into public.users (name, whatsapp) values
  ('Hudson', '98981421535'),
  ('Lucas', '98984644967'),
  ('Marília', '98988055989'),
  ('Luiza', '98991047255'),
  ('Marina', '98991542888'),
  ('Winnie', '31998228363'),
  ('Isabel', '98989142113'),
  ('Ricardo', '98982566296'),
  ('Mariana', '11969297555'),
  ('Fernanda', '98991791999'),
  ('Camila', '98981579257'),
  ('João Pedro', '98984054900')
on conflict (whatsapp) do update set name = excluded.name;

insert into public.predictions (user_id, match_id, home_score, away_score)
select u.id, 'ae940155-fadd-4246-b641-0a3d3605fd03'::uuid, v.home, v.away
from (values
  ('98981421535', 4, 0),
  ('98984644967', 2, 0),
  ('98988055989', 2, 1),
  ('98991047255', 2, 0),
  ('98991542888', 3, 1),
  ('31998228363', 1, 0),
  ('98989142113', 2, 0),
  ('98982566296', 2, 1),
  ('11969297555', 2, 1),
  ('98991791999', 2, 0),
  ('98981579257', 1, 0),
  ('98984054900', 3, 1)
) as v(whatsapp, home, away)
join public.users u on u.whatsapp = v.whatsapp
on conflict (user_id, match_id) do update
  set home_score = excluded.home_score,
      away_score = excluded.away_score,
      updated_at = now();
