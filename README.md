# Balcão dos Funis

Marketplace interno de oportunidades (projetos, vagas e freelas) para alunos das comunidades **Método LTV**, **CAIA** e **AI Society**.

Produto da marca **LTV Tribe** — auto-suficiente, sem dependências operacionais com outros produtos.

## Stack

- **Frontend:** React 18 + Vite 7 + TypeScript + Tailwind 3 + shadcn/ui
- **Backend:** Vercel Functions (Node) em `api/`
- **Banco:** Supabase self-hosted (`db-sigma.vuker.com.br`)
- **Auth:** GoTrue (admin API) + magic link enviado pelo balcão via Resend
- **Email:** Resend (`noreply@mail.ltvtribe.com.br`)
- **Deploy:** Vercel (Git Integration)

## Arquitetura

Frontend e backend convivem no mesmo repo — frontend servido como estático pela Vercel, backend como Vercel Functions sob `/api/*`. Nenhum CRUD direto no Supabase via cliente: tudo passa pelas functions que usam `service_role`.

**Login desacoplado do Sigma:** o stack Supabase é compartilhado mas o balcão NÃO usa o SMTP do GoTrue (que tem sender "Sigma Studio"). O fluxo é:
1. Backend chama `supabase.auth.admin.generateLink({ type: 'magiclink' })` — gera link sem enviar email
2. Backend envia email próprio via Resend com template branded Balcão
3. Usuário clica → GoTrue valida token, cria sessão, redireciona pra `/auth/callback`
4. Supabase-js no callback captura tokens do hash e persiste sessão

Ver `api/_lib/magic-link.ts` e `api/_lib/emails.ts` (`sendMagicLinkEmail`).

## Rotas

| Path | Acesso | Descrição |
|------|--------|-----------|
| `/` | público | Landing |
| `/publicar` | público | Form do contratante |
| `/publicar/sucesso` | público | Confirmação |
| `/login` | público | Magic link request |
| `/auth/callback` | público | Supabase session exchange |
| `/oportunidades` | aluno | Listagem paginada |
| `/oportunidades/:id` | aluno | Detalhe + "Tenho interesse" |
| `/sair` | qualquer | Logout |

## Endpoints (Vercel Functions)

| Path | Método | Descrição |
|------|--------|-----------|
| `/api/balcao/niches` | GET | Lista nichos ativos (ainda existe por compatibilidade, front usa array estático) |
| `/api/balcao/opportunities` | GET | Lista oportunidades (paginada, filtros) |
| `/api/balcao/opportunities` | POST | Cria oportunidade (honeypot + rate limit 5/h) |
| `/api/balcao/opportunities/:id` | GET | Detalhe |
| `/api/balcao/opportunities/:id/interest` | POST | Registra interesse + dispara emails |
| `/api/balcao/auth/request-access` | POST | Gera magic link + envia email (rate limit 10/h) |
| `/api/balcao/me` | GET | Dados do usuário autenticado |

## Desenvolvimento

```bash
npm install
cp .env.example .env   # preencher valores reais
vercel dev --listen 5173
```

Porta 5173 é obrigatória em dev: é a única porta localhost whitelisted no `GOTRUE_URI_ALLOW_LIST` do stack Supabase (sem isso, magic link redireciona pro SITE_URL default).

## Deploy

Git push na `main` → Vercel builda e publica automaticamente.

Domínio produção: `balcao.ltvtribe.com.br` (CNAME → Vercel).

## Env vars (Vercel)

### Frontend (expostas ao browser via Vite)
- `VITE_SUPABASE_URL` — `https://db-sigma.vuker.com.br`
- `VITE_SUPABASE_ANON_KEY` — anon key do stack `sigma-supa`
- `VITE_BALCAO_NAME` — `Balcão dos Funis`

### Backend (server-side nas Functions)
- `SUPABASE_URL` — mesma URL
- `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — keys do stack
- `RESEND_API_KEY` — key com permissão pra enviar de `mail.ltvtribe.com.br`
- `BALCAO_ALLOWED_PRODUCT_IDS` — IDs em `products` elegíveis (ex: `1,20`)
- `BALCAO_FRONTEND_URL` — `https://balcao.ltvtribe.com.br`
- `BALCAO_EMAIL_SENDER` — `Balcão dos Funis <noreply@mail.ltvtribe.com.br>`
- `BALCAO_AUTH_RATE_LIMIT_PER_HOUR` — default 10
- `BALCAO_RATE_LIMIT_PER_HOUR` — default 5 (publicar)
- `NEWSLETTER_ORG_ID` — org_id default pra fallback de leads

## Docs completas

Arquitetura, migrations, sessões de trabalho e decisões: [monorepo `ai-sigma-studio/docs/agency/projects/balcao-dos-funis/`](https://github.com/ddiasmatt/ai-sigma-studio/tree/main/docs/agency/projects/balcao-dos-funis).
