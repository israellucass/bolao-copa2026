-- Normaliza WhatsApp e une cadastros duplicados.
-- Seguro para rodar mais de uma vez no SQL Editor do Supabase.

create or replace function public.canonical_whatsapp(raw text)
returns text
language sql
immutable
as $$
  with digits as (
    select trim(leading '0' from regexp_replace(coalesce(raw, ''), '\D', '', 'g')) as d
  ),
  without_cc as (
    select
      case
        when length(d) > 11 and d like '55%' then substring(d from 3)
        else d
      end as d
    from digits
  ),
  with_mobile_nine as (
    select
      case
        when length(d) = 10 and substring(d, 3, 1) <> '9'
        then substring(d, 1, 2) || '9' || substring(d, 3)
        else d
      end as d
    from without_cc
  )
  select nullif(d, '') from with_mobile_nine;
$$;

-- Conferir duplicatas pelo número canônico (antes de mesclar)
-- select
--   public.canonical_whatsapp(whatsapp) as canonical,
--   count(*) as total,
--   array_agg(whatsapp order by created_at) as formatos,
--   array_agg(id order by created_at) as user_ids
-- from public.users
-- where whatsapp is not null
-- group by 1
-- having count(*) > 1;

-- Mesclar duplicatas pelo número canônico (mantém o cadastro mais antigo)
do $$
declare
  dup record;
  keeper_id uuid;
  dup_id uuid;
  i int;
begin
  for dup in
    select
      public.canonical_whatsapp(whatsapp) as canonical,
      array_agg(id order by created_at) as ids,
      bool_or(is_admin) as any_admin
    from public.users
    where whatsapp is not null
    group by 1
    having count(*) > 1
  loop
    keeper_id := dup.ids[1];

    if dup.any_admin then
      update public.users set is_admin = true where id = keeper_id;
    end if;

    for i in 2..array_length(dup.ids, 1) loop
      dup_id := dup.ids[i];

      delete from public.predictions p
      where p.user_id = dup_id
        and exists (
          select 1
          from public.predictions k
          where k.user_id = keeper_id and k.match_id = p.match_id
        );

      update public.predictions
      set user_id = keeper_id
      where user_id = dup_id;

      delete from public.payments p
      where p.user_id = dup_id
        and exists (
          select 1
          from public.payments k
          where k.user_id = keeper_id and k.match_id = p.match_id
        );

      update public.payments
      set user_id = keeper_id
      where user_id = dup_id;

      delete from public.users where id = dup_id;
    end loop;
  end loop;
end $$;

-- Gravar todos no formato canônico (11 dígitos)
update public.users
set whatsapp = public.canonical_whatsapp(whatsapp)
where whatsapp is not null
  and whatsapp is distinct from public.canonical_whatsapp(whatsapp);
