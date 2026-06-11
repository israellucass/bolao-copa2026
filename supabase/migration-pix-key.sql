-- Chave Pix opcional por jogador (para receber apostas via Pix).
alter table public.users add column if not exists pix_key text;
