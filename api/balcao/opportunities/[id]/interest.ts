import { route, getAuthHeader } from "../../../_lib/vercel.js";
import { requireStudent } from "../../../_lib/auth.js";
import { sendInterestToContractor, sendInterestToStudent } from "../../../_lib/emails.js";
import { supabaseAdmin } from "../../../_lib/supabase.js";
import { signCloseToken } from "../../../_lib/close-token.js";

const FRONTEND_URL = (process.env.BALCAO_FRONTEND_URL ?? "https://balcao.ltvtribe.com.br").replace(/\/$/, "");

interface ContactPayload {
  email: string | null;
  whatsapp: string | null;
  instagram: string | null;
  contact_message: string | null;
  public_contact_method: string | null;
}

export default route(["POST"], async (req, res) => {
  const { user, prospect } = await requireStudent(getAuthHeader(req));
  const id = String(req.query.id ?? "");
  if (!id) return res.status(400).json({ detail: "id obrigatório" });

  const supa = supabaseAdmin();

  const { data: oppRows, error: oppErr } = await supa
    .from("balcao_opportunities")
    .select("id,nome,email,nicho,whatsapp,instagram,contact_message,public_contact_method,closed_at")
    .eq("id", id)
    .limit(1);
  if (oppErr) return res.status(500).json({ detail: oppErr.message });
  if (!oppRows || oppRows.length === 0) return res.status(404).json({ detail: "Oportunidade não encontrada" });

  const opp = oppRows[0] as {
    id: string;
    nome: string | null;
    email: string | null;
    nicho: string | null;
    whatsapp: string | null;
    instagram: string | null;
    contact_message: string | null;
    public_contact_method: string | null;
    closed_at: string | null;
  };

  if (opp.closed_at) {
    return res.status(410).json({ detail: "Esta oportunidade já foi fechada pelo contratante." });
  }

  const contact: ContactPayload = {
    email: opp.email,
    whatsapp: opp.whatsapp,
    instagram: opp.instagram,
    contact_message: opp.contact_message,
    public_contact_method: opp.public_contact_method,
  };

  const { data: inserted, error: insErr } = await supa
    .from("balcao_interests")
    .insert({
      opportunity_id: id,
      prospect_id: prospect.id,
      auth_user_id: user.user_id,
    })
    .select("id")
    .limit(1);

  const alreadyRegistered = !!(insErr && insErr.code === "23505");

  if (insErr && !alreadyRegistered) {
    console.error("failed to insert interest", insErr);
    return res.status(500).json({ detail: insErr.message });
  }

  if (!alreadyRegistered) {
    const studentEmail = prospect.email ?? user.email;
    const studentWhatsapp = prospect.phone ? String(prospect.phone) : "";
    const studentName = prospect.name ?? "";
    const closeToken = signCloseToken(opp.id);
    const closeUrl = `${FRONTEND_URL}/api/balcao/opportunities/close?id=${encodeURIComponent(opp.id)}&token=${closeToken}`;

    await Promise.allSettled([
      sendInterestToContractor({
        contractorEmail: String(opp.email ?? ""),
        contractorName: String(opp.nome ?? ""),
        studentName,
        studentEmail,
        studentWhatsapp,
        closeUrl,
      }),
      sendInterestToStudent({
        studentEmail,
        studentName,
        contractorName: String(opp.nome ?? ""),
        opportunityNicho: String(opp.nicho ?? ""),
      }),
    ]);
  }

  res.status(alreadyRegistered ? 200 : 201).json({
    ok: true,
    contact,
    already_registered: alreadyRegistered,
    interest_id: inserted?.[0]?.id ?? null,
  });
});
