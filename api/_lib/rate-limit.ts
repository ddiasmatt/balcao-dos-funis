import { supabaseAdmin } from "./supabase";

/**
 * Rate limit distribuído via RPC Postgres `balcao_check_rate_limit`.
 * Retorna true se pode prosseguir (e já registra o request); false se excedeu.
 *
 * Fail-open: se a RPC falhar por qualquer motivo, deixamos passar (evita
 * negação de serviço por erro de infra). O registro no log do Vercel permite
 * detecção.
 */
export async function checkRateLimit(ip: string, endpoint: string, maxPerHour: number): Promise<boolean> {
  try {
    const supa = supabaseAdmin();
    const { data, error } = await supa.rpc("balcao_check_rate_limit", {
      p_ip: ip,
      p_endpoint: endpoint,
      p_max_per_hour: maxPerHour,
    });
    if (error) {
      console.error("rate-limit RPC error", error);
      return true; // fail-open
    }
    return data === true;
  } catch (err) {
    console.error("rate-limit exception", err);
    return true;
  }
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for") ?? "";
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
