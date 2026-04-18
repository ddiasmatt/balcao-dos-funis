import { route } from "../../_lib/vercel.js";
import { supabaseAdmin } from "../../_lib/supabase.js";
import { verifyCloseToken } from "../../_lib/close-token.js";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlPage(title: string, heading: string, body: string, accent: "ok" | "warn" | "error" = "ok"): string {
  const accentColor = accent === "error" ? "#c2410c" : accent === "warn" ? "#a16207" : "#1d1d1f";
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1d1d1f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f5f5f7;min-height:100vh;">
    <tr><td align="center" style="padding:60px 20px;">
      <table role="presentation" width="520" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;background-color:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px 36px 0 36px;">
          <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#7c6fff;font-weight:600;">Balcão dos Funis</div>
        </td></tr>
        <tr><td style="padding:16px 36px 32px 36px;color:#1d1d1f;font-size:15px;line-height:1.65;">
          <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:600;color:${accentColor};">${escapeHtml(heading)}</h1>
          ${body}
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid rgba(0,0,0,0.08);color:#86868b;font-size:12px;line-height:1.6;">
          Dúvidas? Responda o email do Balcão dos Funis e a gente te ajuda.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function formatDateBrt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default route(["GET"], async (req, res) => {
  const id = String(req.query.id ?? "");
  const token = String(req.query.token ?? "");

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (!id || !token || !verifyCloseToken(id, token)) {
    return res.status(403).send(
      htmlPage(
        "Link inválido",
        "Link inválido ou expirado",
        `<p style="margin:0 0 12px 0;">Não foi possível validar este link. Verifique se você copiou a URL completa do email.</p>`,
        "error",
      ),
    );
  }

  const supa = supabaseAdmin();

  const { data: oppRows, error: oppErr } = await supa
    .from("balcao_opportunities")
    .select("id,nome,closed_at")
    .eq("id", id)
    .limit(1);

  if (oppErr || !oppRows || oppRows.length === 0) {
    return res.status(404).send(
      htmlPage(
        "Oportunidade não encontrada",
        "Oportunidade não encontrada",
        `<p style="margin:0 0 12px 0;">Essa oportunidade não está mais disponível.</p>`,
        "error",
      ),
    );
  }

  const opp = oppRows[0] as { id: string; nome: string | null; closed_at: string | null };

  if (opp.closed_at) {
    return res.status(200).send(
      htmlPage(
        "Oportunidade já fechada",
        "Oportunidade já foi fechada",
        `<p style="margin:0 0 12px 0;">Esta oportunidade foi marcada como fechada em <strong>${escapeHtml(formatDateBrt(opp.closed_at))}</strong> e já não aparece mais para os alunos.</p>
         <p style="margin:0;color:#6e6e73;font-size:13px;">Se precisar republicar, basta preencher o formulário de novo no site.</p>`,
        "warn",
      ),
    );
  }

  const nowIso = new Date().toISOString();
  const { error: updErr } = await supa
    .from("balcao_opportunities")
    .update({ closed_at: nowIso })
    .eq("id", id)
    .is("closed_at", null);

  if (updErr) {
    console.error("failed to close opportunity", updErr);
    return res.status(500).send(
      htmlPage(
        "Erro",
        "Não conseguimos fechar agora",
        `<p style="margin:0;">Tente novamente em alguns segundos. Se persistir, responda o email que você recebeu.</p>`,
        "error",
      ),
    );
  }

  return res.status(200).send(
    htmlPage(
      "Oportunidade fechada",
      "Oportunidade fechada!",
      `<p style="margin:0 0 12px 0;">Pronto. A oportunidade saiu do balcão e nenhum aluno novo consegue ver os dados de contato.</p>
       <p style="margin:0 0 12px 0;">Obrigado por nos avisar — boa sorte com o projeto!</p>
       <p style="margin:24px 0 0 0;color:#6e6e73;font-size:13px;">Fechada em ${escapeHtml(formatDateBrt(nowIso))}.</p>`,
      "ok",
    ),
  );
});
