import { z } from "zod";
import { route, getAuthHeader, clientIpFromReq } from "../../_lib/vercel.js";
import { requireStudent } from "../../_lib/auth.js";
import { checkRateLimit } from "../../_lib/rate-limit.js";
import { supabaseAdmin } from "../../_lib/supabase.js";
import { sendSubmissionConfirmation } from "../../_lib/emails.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createSchema = z.object({
  nome: z.string().trim().min(2).max(200),
  email: z.string().transform((v) => (v ?? "").trim().toLowerCase()).refine((v) => emailRegex.test(v), "Email inválido"),
  nicho_slug: z.string().min(2).max(60),
  instagram: z.string().trim().min(2).max(100),
  whatsapp: z.string().trim().min(8).max(40),
  faturamento: z.string().trim().min(1).max(100),
  como_ajudar: z.string().trim().min(10).max(2000),
  por_que_escolher: z.string().trim().min(10).max(2000),
  contact_message: z.string().trim().max(500).optional(),
  website: z.string().max(200).optional(), // honeypot
});

async function handleGet(req: import("@vercel/node").VercelRequest, res: import("@vercel/node").VercelResponse) {
  await requireStudent(getAuthHeader(req));

  const page = Math.max(1, Number(req.query.page ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(req.query.page_size ?? 20)));
  const nicho = typeof req.query.nicho === "string" ? req.query.nicho : undefined;
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const sort = typeof req.query.sort === "string" ? req.query.sort : "recent";

  const supa = supabaseAdmin();
  const nowIso = new Date().toISOString();

  let query = supa
    .from("balcao_opportunities")
    .select(
      "id,created_at,updated_at,expires_at,nome,nicho,nicho_slug,instagram,faturamento,como_ajudar,por_que_escolher,public_contact_method,show_full_contact,contact_message",
      { count: "exact" },
    )
    .gt("expires_at", nowIso)
    .is("closed_at", null)
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (sort === "faturamento") {
    query = query.order("faturamento", { ascending: false }).order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (nicho) {
    query = query.or(`nicho_slug.eq.${nicho},nicho.ilike.%${nicho}%`);
  }
  if (q) {
    const p = `%${q}%`;
    query = query.or(`nome.ilike.${p},por_que_escolher.ilike.${p},como_ajudar.ilike.${p},nicho.ilike.${p}`);
  }

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ detail: error.message });

  const total = count ?? 0;
  res.status(200).json({
    data: data ?? [],
    total,
    page,
    page_size: pageSize,
    has_more: page * pageSize < total,
  });
}

async function handlePost(req: import("@vercel/node").VercelRequest, res: import("@vercel/node").VercelResponse) {
  const ip = clientIpFromReq(req);
  const max = Number(process.env.BALCAO_RATE_LIMIT_PER_HOUR ?? 5);
  const allowed = await checkRateLimit(ip, "opportunities", max);
  if (!allowed) {
    return res.status(429).json({ detail: "Você atingiu o limite de submissões por hora. Tente novamente mais tarde." });
  }

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ detail: parsed.error.issues.map((i) => i.message).join(", ") });
  }
  const v = parsed.data;

  if (v.website) {
    console.warn("honeypot triggered", { ip, email: v.email });
    return res.status(201).json({ ok: true });
  }

  const supa = supabaseAdmin();
  const { data: niche } = await supa
    .from("balcao_niches")
    .select("slug,label")
    .eq("slug", v.nicho_slug)
    .eq("is_active", true)
    .limit(1);
  if (!niche || niche.length === 0) {
    return res.status(422).json({ detail: "Nicho inválido" });
  }
  const nichoLabel = niche[0].label as string;

  const insertPayload = {
    nome: v.nome.trim(),
    email: v.email,
    nicho: nichoLabel,
    nicho_slug: v.nicho_slug,
    instagram: v.instagram.trim().replace(/^@/, ""),
    whatsapp: v.whatsapp.trim(),
    faturamento: v.faturamento.trim(),
    como_ajudar: v.como_ajudar.trim(),
    por_que_escolher: v.por_que_escolher.trim(),
    contact_message: (v.contact_message ?? "").trim() || null,
    public_contact_method: "whatsapp",
    show_full_contact: false,
  };

  const { data, error } = await supa
    .from("balcao_opportunities")
    .insert(insertPayload)
    .select("id")
    .limit(1);

  if (error) {
    console.error("insert opportunity failed", error);
    return res.status(500).json({ detail: "Falha ao salvar. Tente novamente em instantes." });
  }

  sendSubmissionConfirmation(v.email, v.nome).catch((e) => console.error("submission email failed", e));

  res.status(201).json({ ok: true, id: data?.[0]?.id ?? null });
}

export default route(["GET", "POST"], async (req, res) => {
  if (req.method === "GET") return handleGet(req, res);
  return handlePost(req, res);
});
