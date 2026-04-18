-- =============================================================================
-- Balcão dos Funis — interests table + closed_at em opportunities
--
-- 1) balcao_interests: rastreia cada aluno que "exibiu informações" de uma opp.
--    UNIQUE(opportunity_id, prospect_id) garante idempotência — alunos podem
--    reabrir a dialog, mas só registra 1x e só envia email ao dono 1x.
--
-- 2) balcao_opportunities.closed_at: timestamp de quando o dono fechou a opp
--    pelo link HMAC recebido no email. Opps com closed_at preenchido somem
--    da listagem.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.balcao_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.balcao_opportunities(id) ON DELETE CASCADE,
  prospect_id bigint NOT NULL,
  auth_user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT balcao_interests_opp_prospect_unique UNIQUE (opportunity_id, prospect_id)
);

CREATE INDEX IF NOT EXISTS idx_balcao_interests_opportunity
  ON public.balcao_interests (opportunity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_balcao_interests_prospect
  ON public.balcao_interests (prospect_id, created_at DESC);

ALTER TABLE public.balcao_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balcao_interests FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_deny_balcao_interests ON public.balcao_interests;
DROP POLICY IF EXISTS auth_deny_balcao_interests ON public.balcao_interests;
DROP POLICY IF EXISTS service_all_balcao_interests ON public.balcao_interests;

CREATE POLICY anon_deny_balcao_interests
  ON public.balcao_interests FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY auth_deny_balcao_interests
  ON public.balcao_interests FOR ALL TO authenticated USING (false) WITH CHECK (false);

CREATE POLICY service_all_balcao_interests
  ON public.balcao_interests FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON public.balcao_interests TO service_role;


ALTER TABLE public.balcao_opportunities
  ADD COLUMN IF NOT EXISTS closed_at timestamptz NULL;

CREATE INDEX IF NOT EXISTS idx_balcao_opportunities_closed_at
  ON public.balcao_opportunities (closed_at) WHERE closed_at IS NULL;
