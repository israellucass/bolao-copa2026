# Bolão Copa 2026 — Seleção Brasileira

App mobile-first para palpites dos jogos do Brasil na Copa 2026, feito para um grupo de amigos no WhatsApp.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** (`@supabase/supabase-js`)

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No **SQL Editor**, execute o arquivo `supabase/schema.sql`
3. Copie `.env.local.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
FOOTBALL_DATA_API_KEY=seu-token-football-data
```

**football-data.org (importação automática):** cadastre-se grátis em [football-data.org](https://www.football-data.org/client/register), copie o token da sua conta e cole em `FOOTBALL_DATA_API_KEY`.

Se o banco já existia antes desta função, rode também `supabase/migration-external-fixture-id.sql` no SQL Editor.

### 3. Definir o admin

Após o primeiro login via WhatsApp, promova seu usuário no SQL Editor:

```sql
UPDATE public.users SET is_admin = true WHERE whatsapp = '5511999999999';
```

(Use apenas dígitos no WhatsApp, ex: `5511999999999`)

### 4. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

Se o banco já existia, rode também `supabase/migration-nullable-name.sql` no SQL Editor.

## Publicar grátis (Vercel)

1. Crie um repositório no [GitHub](https://github.com/new) chamado `bolao-copa2026`
2. No terminal, na pasta do projeto:

```bash
git add .
git commit -m "Bolão Copa 2026"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/bolao-copa2026.git
git push -u origin main
```

3. Acesse [vercel.com](https://vercel.com), faça login com GitHub e clique **Add New → Project**
4. Importe o repositório `bolao-copa2026`
5. Em **Environment Variables**, adicione as mesmas variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `FOOTBALL_DATA_API_KEY`
6. Clique **Deploy** — em ~2 min você recebe um link tipo `https://bolao-copa2026.vercel.app`
7. Compartilhe esse link no grupo do WhatsApp

## Funcionalidades

| Rota | Descrição |
|------|-----------|
| `/login` | Entrada só com WhatsApp (número fica salvo no aparelho) |
| `/perfil` | Definir ou editar seu nome no bolão |
| `/` | Dashboard com jogos, palpites e status de pagamento |
| `/ranking` | Classificação por pontos totais |
| `/admin` | Importar jogos da API, gestão manual, pagamentos e resultados |

## Regras de pontuação

| Regra | Pontos |
|-------|--------|
| Placar exato | 25 |
| Resultado + saldo de gols corretos | 15 |
| Apenas resultado correto | 10 |
| Empate correto (placar errado) | 12 |
| Bônus por gols exatos de cada time | +2 cada |

## Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run start    # servidor de produção
npx tsx lib/scoring.test.ts  # testar pontuação
```
