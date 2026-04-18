import { z } from "zod";
import { route, getAuthHeader } from "../../../_lib/vercel.js";
import { requireStudent } from "../../../_lib/auth.js";
import { sendInterestToContractor, sendInterestToStudent } from "../../../_lib/emails.js";
import { supabaseAdmin } from "../../../_lib/supabase.js";

const bodySchema = z.object({
  message: z.string().trim().max(1000).optional(),
});

export default route(["POST"], async (req, res) => {
  const { user, prospect } = await requireStudent(getAuthHeader(req));
  const id = String(req.query.id ?? "");
  if (!id) return res.status(400).json({ detail: "id obrigatório" });

  const parsed = bodySchema.safeParse(req.body ?? {});
  const message = parsed.success ? (parsed.data.message ?? null) : null;

  const supa = supabaseAdmin();

  const { data: oppRows, error: oppErr } = await supa
    .from("balcao_opportunities")
    .select("id,nome,email,nicho,whatsapp")
    .eq("id", id)
    .limit(1);
  if (oppErr) return res.status(500).json({ detail: oppErr.message });
  if (!oppRows || oppRows.length === 0) return res.status(404).json({ detail: "Oportunidade não encontrada" });
  const opp = oppRows[0];

  const { data: existing } = await supa
    .from("balcao_interests")
    .select("id")
    .eq("opportunity_id", id)
    .eq("prospect_id", prospect.id)
    .limit(1);
  if (existing && existing.length > 0) {
    return res.status(409).json({ detail: "Você já manifestou interesse nesta oportunidade." });
  }

  const { data: inserted, error: insErr } = await supa
    .from("balcao_interests")
    .insert({
      opportunity_id: id,
      prospect_id: prospect.id,
      auth_user_id: user.user_id,
      message,
    })
    .select("id")
    .limit(1);

  if (insErr) {
    if (insErr.code === "23505") {
      return res.status(409).json({ detail: "Você já manifestou interesse nesta oportunidade." });
    }
    return res.status(500).json({ detail: insErr.message });
  }

  const studentEmail = prospect.email ?? user.email;
  const studentWhatsapp = prospect.phone ? String(prospect.phone) : "";
  const studentName = prospect.name ?? "";

  await Promise.allSettled([
    sendInterestToContractor({
      contractorEmail: String(opp.email),
      contractorName: String(opp.nome ?? ""),
      studentName,
      studentEmail,
      studentWhatsapp,
      message,
    }),
    sendInterestToStudent({
      studentEmail,
      studentName,
      contractorName: String(opp.nome ?? ""),
      opportunityNicho: String(opp.nicho ?? ""),
    }),
  ]);

  res.status(201).json({ ok: true, interest_id: inserted?.[0]?.id ?? null });
});
