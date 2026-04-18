-- Security fix (P0): remover RPC get_public_opportunities()
--
-- A funcao estava com SECURITY DEFINER + GRANT EXECUTE TO anon, fazendo
-- bypass total da RLS e retornando 105 registros com PII (email, WhatsApp,
-- nome, faturamento) sem autenticacao.
--
-- Nao ha mais consumidores: o frontend usa GET /api/balcao/opportunities
-- (Vercel Function) que exige auth via requireStudent() e filtra PII no
-- backend antes de responder.

REVOKE EXECUTE ON FUNCTION public.get_public_opportunities() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_public_opportunities() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_public_opportunities() FROM public;

DROP FUNCTION IF EXISTS public.get_public_opportunities();
