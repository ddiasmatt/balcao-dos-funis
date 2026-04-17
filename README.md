# Balcão dos Funis

Marketplace interno de oportunidades (projetos, vagas e freelas) para alunos das comunidades **Método LTV**, **CAIA** e **AI Society**.

## Stack

- React 18 + Vite 7 + TypeScript
- Tailwind CSS 3 + shadcn/ui (tema OKLCH dark)
- TanStack Query 5, React Router 7, GSAP 3
- Supabase Auth (magic link, SMTP via Resend)
- Backend: Sigma API (`https://api-sigma.vuker.com.br`)
- Deploy: Vercel (Git Integration)

## Arquitetura

- Frontend consome a Sigma API (FastAPI) em `/api/balcao/*`.
- Supabase JS é usado **apenas para auth** (magic link + session). Nenhum CRUD direto no banco.
- Alunos elegíveis = `prospects_subscriptions.status='active'` em produtos listados em `BALCAO_ALLOWED_PRODUCT_IDS` no backend.
- Contratantes publicam aberto (rate-limited 5/hora por IP + honeypot).
- Handshake de interesse: aluno → backend cria `balcao_interests` + Resend dispara email ao contratante com contato do aluno.

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

## Desenvolvimento

```bash
npm install
cp .env.example .env   # e preencha VITE_SUPABASE_ANON_KEY real
npm run dev
```

Pré-requisito: Sigma API rodando em `http://localhost:8000` (ou ajuste `VITE_SIGMA_API_URL`).

## Deploy

Git push na `main` → Vercel builda e publica automaticamente.
Domínio produção: `app.ltvtribe.com.br` (CNAME → Vercel).

## Env vars (Vercel)

- `VITE_SIGMA_API_URL` — URL pública da Sigma API (`https://api-sigma.vuker.com.br`)
- `VITE_SUPABASE_URL` — `https://db-sigma.vuker.com.br`
- `VITE_SUPABASE_ANON_KEY` — anon key do stack `sigma-supa`
- `VITE_BALCAO_NAME` — `Balcão dos Funis`
