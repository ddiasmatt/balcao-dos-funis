-- =============================================================================
-- Balcão dos Funis — Rate limit distribuído via Postgres
-- Necessário porque serverless functions (Vercel) são stateless — não dá pra
-- usar deque em memória como no processo FastAPI anterior.
--
-- Estratégia: tabela de log com GC automático. RPC atômico faz count+insert.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.balcao_rate_log (
  id bigserial PRIMARY KEY,
  ip text NOT NULL,
  endpoint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_balcao_rate_log_lookup
  ON public.balcao_rate_log (ip, endpoint, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_balcao_rate_log_gc
  ON public.balcao_rate_log (created_at);

ALTER TABLE public.balcao_rate_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balcao_rate_log FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_deny_balcao_rate_log ON public.balcao_rate_log;
DROP POLICY IF EXISTS auth_deny_balcao_rate_log ON public.balcao_rate_log;
DROP POLICY IF EXISTS service_all_balcao_rate_log ON public.balcao_rate_log;

CREATE POLICY anon_deny_balcao_rate_log
  ON public.balcao_rate_log FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY auth_deny_balcao_rate_log
  ON public.balcao_rate_log FOR ALL TO authenticated USING (false) WITH CHECK (false);

CREATE POLICY service_all_balcao_rate_log
  ON public.balcao_rate_log FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON public.balcao_rate_log TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.balcao_rate_log_id_seq TO service_role;


-- RPC atômico: retorna TRUE se pode prosseguir (INSERE log), FALSE se excedeu.
-- Faz GC automático em logs > 2h pra não crescer indefinidamente.
CREATE OR REPLACE FUNCTION public.balcao_check_rate_limit(
  p_ip text,
  p_endpoint text,
  p_max_per_hour int DEFAULT 10
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
BEGIN
  -- GC oportunístico (probabilístico ~5% das chamadas pra não sobrecarregar)
  IF random() < 0.05 THEN
    DELETE FROM public.balcao_rate_log
    WHERE created_at < (now() - interval '2 hours');
  END IF;

  -- Conta requests recentes pro mesmo IP+endpoint
  SELECT count(*) INTO v_count
  FROM public.balcao_rate_log
  WHERE ip = p_ip
    AND endpoint = p_endpoint
    AND created_at > (now() - interval '1 hour');

  IF v_count >= p_max_per_hour THEN
    RETURN false;
  END IF;

  INSERT INTO public.balcao_rate_log (ip, endpoint)
  VALUES (p_ip, p_endpoint);

  RETURN true;
END;
$$;

ALTER FUNCTION public.balcao_check_rate_limit(text, text, int) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.balcao_check_rate_limit(text, text, int) TO service_role;
