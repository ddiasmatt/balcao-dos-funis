import { route, getAuthHeader } from "../../../_lib/vercel.js";
import { requireStudent } from "../../../_lib/auth.js";
import { supabaseAdmin } from "../../../_lib/supabase.js";

export default route(["GET"], async (req, res) => {
  await requireStudent(getAuthHeader(req));
  const id = String(req.query.id ?? "");
  if (!id) return res.status(400).json({ detail: "id obrigatório" });

  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from("balcao_opportunities")
    .select(
      "id,created_at,updated_at,expires_at,nome,nicho,nicho_slug,instagram,faturamento,como_ajudar,por_que_escolher,public_contact_method,show_full_contact,contact_message",
    )
    .eq("id", id)
    .limit(1);

  if (error) return res.status(500).json({ detail: error.message });
  if (!data || data.length === 0) return res.status(404).json({ detail: "Oportunidade não encontrada" });
  res.status(200).json(data[0]);
});
