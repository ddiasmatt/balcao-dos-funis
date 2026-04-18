import { route } from "../_lib/vercel.js";
import { supabaseAdmin } from "../_lib/supabase.js";

export default route(["GET"], async (_req, res) => {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from("balcao_niches")
    .select("slug,label,description,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) return res.status(500).json({ detail: error.message });
  res.status(200).json(data ?? []);
});
