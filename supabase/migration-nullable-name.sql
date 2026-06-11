-- Permite cadastro só com WhatsApp; nome definido depois em /perfil
alter table public.users alter column name drop not null;
