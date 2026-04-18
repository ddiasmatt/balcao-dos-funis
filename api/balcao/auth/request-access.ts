import { z } from "zod";
import { route, clientIpFromReq } from "../../_lib/vercel.js";
import { findActiveSubscription, findProspectByEmail, type Prospect } from "../../_lib/auth.js";
import { sendNoActiveSubscription } from "../../_lib/emails.js";
import { sendMagicLink } from "../../_lib/magic-link.js";
import { checkRateLimit } from "../../_lib/rate-limit.js";
import { defaultOrgId, supabaseAdmin } from "../../_lib/supabase.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const schema = z.object({
  email: z
    .string()
    .transform((v) => (v ?? "").trim().toLowerCase())
    .refine((v) => emailRegex.test(v), "Email inválido"),
});

async function upsertBalcaoLead(email: string): Promise<Prospect | null> {
  const supa = supabaseAdmin();
  const payload = {
    email,
    organization_id: defaultOrgId(),
    prospect_utm_source: "balcao",
    prospect_utm_medium: "organic",
    prospect_utm_campaign: "balcao_dos_funis",
  };

  const { data, error } = await supa
    .from("prospects")
    .upsert(payload, { onConflict: "email", ignoreDuplicates: true })
    .select("id,email,name,phone,organization_id");

  if (error) {
    console.error("upsertBalcaoLead error", error);
    return null;
  }
  if (data && data.length > 0) return data[0] as Prospect;

  // row já existia — busca o existente
  return findProspectByEmail(email);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default route(["POST"], async (req, res) => {
  const ip = clientIpFromReq(req);
  const maxPerHour = Number(process.env.BALCAO_AUTH_RATE_LIMIT_PER_HOUR ?? 10);
  const allowed = await checkRateLimit(ip, "auth/request-access", maxPerHour);
  if (!allowed) {
    return res.status(429).json({ detail: "Muitas tentativas. Aguarde alguns minutos e tente novamente." });
  }

  const start = Date.now();
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ detail: parsed.error.issues.map((i) => i.message).join(", ") });
  }
  const email = parsed.data.email;

  try {
    let prospect = await findProspectByEmail(email);
    if (prospect === null) {
      prospect = await upsertBalcaoLead(email);
      if (prospect) await sendNoActiveSubscription(email, prospect.name);
    } else {
      const sub = await findActiveSubscription(prospect.id);
      if (sub) {
        await sendMagicLink(email);
      } else {
        await sendNoActiveSubscription(email, prospect.name);
      }
    }
  } catch (err) {
    console.error("request-access unexpected", err);
  }

  // anti-timing: ≥ 600ms
  const elapsed = Date.now() - start;
  if (elapsed < 600) await sleep(600 - elapsed);

  res.status(200).json({
    ok: true,
    message: "Se houver uma assinatura ativa para este email, você vai receber um link de acesso em instantes.",
  });
});
