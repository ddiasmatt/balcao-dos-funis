import { createClient } from "@supabase/supabase-js";

function must(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`env ${name} obrigatória`);
  return v;
}

export function supabaseAdmin() {
  return createClient(must("SUPABASE_URL"), must("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function supabaseAnonHeaders(): Record<string, string> {
  return {
    apikey: must("SUPABASE_ANON_KEY"),
    "Content-Type": "application/json",
  };
}

export function supabaseUrl(): string {
  return must("SUPABASE_URL").replace(/\/$/, "");
}

export function allowedProductIds(): number[] {
  const raw = process.env.BALCAO_ALLOWED_PRODUCT_IDS ?? "1,20";
  return raw
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export function defaultOrgId(): string {
  const id = process.env.BALCAO_DEFAULT_ORG_ID ?? process.env.NEWSLETTER_ORG_ID;
  if (!id) throw new Error("organization_id não configurado (BALCAO_DEFAULT_ORG_ID ou NEWSLETTER_ORG_ID)");
  return id;
}
