import { Resend } from "resend";

const SENDER = process.env.BALCAO_EMAIL_SENDER ?? "Balcão dos Funis <noreply@mail.ltvtribe.com.br>";
const FRONTEND_URL = (process.env.BALCAO_FRONTEND_URL ?? "https://balcao.ltvtribe.com.br").replace(/\/$/, "");

function resend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY não configurada");
  return new Resend(key);
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function baseHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1d1d1f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f5f5f7;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px 0 32px;">
          <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#7c6fff;font-weight:600;">Balcão dos Funis</div>
        </td></tr>
        <tr><td style="padding:16px 32px 32px 32px;color:#1d1d1f;font-size:15px;line-height:1.65;">
          ${body}
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid rgba(0,0,0,0.08);color:#86868b;font-size:12px;line-height:1.6;">
          Você está recebendo este email porque interagiu com o Balcão dos Funis.<br>
          <a href="${FRONTEND_URL}" style="color:#7c6fff;text-decoration:none;">${FRONTEND_URL.replace(/https?:\/\//, "")}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export interface EmailResult {
  id: string | null;
  ok: boolean;
}

async function send(to: string, subject: string, html: string, replyTo?: string): Promise<EmailResult> {
  try {
    const r = await resend().emails.send({
      from: SENDER,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    } as any);
    return { id: r.data?.id ?? null, ok: !r.error };
  } catch (err) {
    console.error("send email failed", err);
    return { id: null, ok: false };
  }
}

export async function sendMagicLinkEmail(email: string, actionLink: string): Promise<EmailResult> {
  const safeLink = escapeHtml(actionLink);
  const body = `
    <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:600;color:#1d1d1f;">Seu link de acesso</h1>
    <p style="margin:0 0 14px 0;">Clique no botão abaixo pra entrar no <strong>Balcão dos Funis</strong>. O link vale por 1 hora.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0;">
      <tr><td align="center">
        <a href="${safeLink}" style="display:inline-block;padding:14px 32px;background:#7c6fff;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">Entrar no Balcão</a>
      </td></tr>
    </table>
    <p style="margin:20px 0 8px 0;color:#6e6e73;font-size:13px;">Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
    <p style="margin:0 0 20px 0;font-size:12px;word-break:break-all;"><a href="${safeLink}" style="color:#7c6fff;text-decoration:none;">${safeLink}</a></p>
    <p style="margin:20px 0 0 0;color:#86868b;font-size:12px;">Não pediu esse link? Pode ignorar este email — ele expira em 1 hora e sem ele ninguém consegue entrar.</p>
  `;
  return send(email, "Seu link pra entrar no Balcão dos Funis", baseHtml("Seu link de acesso", body));
}

export async function sendSubmissionConfirmation(email: string, nome: string): Promise<EmailResult> {
  const first = escapeHtml((nome || "").split(" ")[0] ?? "");
  const body = `
    <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:600;color:#1d1d1f;">Oi, ${first}!</h1>
    <p style="margin:0 0 12px 0;">Recebemos sua oportunidade no <strong>Balcão dos Funis</strong>. Ela já está visível para a nossa comunidade de alunos.</p>
    <p style="margin:0 0 12px 0;">Quando um aluno visualizar seus dados de contato, você vai receber um email avisando — e com um botão pra fechar a oportunidade caso já tenha fechado negócio.</p>
    <p style="margin:24px 0 0 0;color:#6e6e73;font-size:13px;">Sua oportunidade fica visível por 60 dias. Dúvidas? Só responder este email.</p>
  `;
  return send(email, "Sua oportunidade está no Balcão dos Funis", baseHtml("Sua oportunidade está no ar", body));
}

export async function sendNoActiveSubscription(email: string, name: string | null): Promise<EmailResult> {
  const first = escapeHtml((name ?? "").split(" ")[0] || "aluno");
  const body = `
    <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:600;color:#1d1d1f;">Oi, ${first}!</h1>
    <p style="margin:0 0 14px 0;">Você tentou entrar no <strong>Balcão dos Funis</strong>, mas ele é exclusivo pra alunos com assinatura ativa nas comunidades do Método LTV.</p>
    <p style="margin:0 0 14px 0;">Hoje têm acesso quem é aluno ativo de:</p>
    <ul style="margin:0 0 20px 20px;padding:0;color:#1d1d1f;">
      <li style="margin:6px 0;"><strong>Método LTV</strong> — operação completa de vendas e escala</li>
      <li style="margin:6px 0;"><strong>AI Society</strong> — comunidade de operação com IA</li>
      <li style="margin:6px 0;"><strong>CAIA</strong> — certificação agência de IA</li>
    </ul>
    <p style="margin:0 0 14px 0;">Se sua assinatura acabou ou expirou, é só reativar. Se nunca foi aluno, os links abaixo mostram o que cada comunidade resolve.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;">
      <tr><td align="center" style="padding:0;">
        <a href="https://metodoltv.com.br" style="display:inline-block;padding:12px 24px;background:#7c6fff;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Conhecer Método LTV</a>
      </td></tr>
    </table>
    <p style="margin:20px 0 0 0;color:#6e6e73;font-size:13px;">
      Assim que sua assinatura estiver ativa, é só voltar em
      <a href="${FRONTEND_URL}/login" style="color:#7c6fff;text-decoration:none;">${FRONTEND_URL.replace(/https?:\/\//, "")}/login</a>
      e o acesso libera na hora.
    </p>
    <p style="margin:14px 0 0 0;color:#86868b;font-size:12px;">Dúvidas? Responde este email e a gente te ajuda.</p>
  `;
  return send(email, "Acesso ao Balcão dos Funis", baseHtml("Acesso ao Balcão", body));
}

export async function sendInterestToContractor(params: {
  contractorEmail: string;
  contractorName: string;
  studentName: string;
  studentEmail: string;
  studentWhatsapp: string;
  closeUrl: string;
}): Promise<EmailResult> {
  const safeContractor = escapeHtml((params.contractorName || "").split(" ")[0] ?? "");
  const safeStudent = escapeHtml(params.studentName || "Um aluno");
  const safeEmail = escapeHtml(params.studentEmail);
  const safeWhats = escapeHtml(params.studentWhatsapp || "—");
  const safeCloseUrl = escapeHtml(params.closeUrl);

  const body = `
    <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:600;color:#1d1d1f;">Novo interesse na sua oportunidade</h1>
    <p style="margin:0 0 16px 0;">Oi, ${safeContractor}. <strong>${safeStudent}</strong> acabou de ver os dados de contato da oportunidade que você publicou.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f5f5f7;border:1px solid rgba(0,0,0,0.08);border-radius:10px;margin:18px 0;">
      <tr><td style="padding:16px 20px;font-size:14px;color:#6e6e73;">Nome</td><td style="padding:16px 20px;font-size:14px;color:#1d1d1f;text-align:right;">${safeStudent}</td></tr>
      <tr><td style="padding:0 20px 16px 20px;font-size:14px;color:#6e6e73;">Email</td><td style="padding:0 20px 16px 20px;font-size:14px;color:#1d1d1f;text-align:right;"><a href="mailto:${safeEmail}" style="color:#7c6fff;text-decoration:none;">${safeEmail}</a></td></tr>
      <tr><td style="padding:0 20px 16px 20px;font-size:14px;color:#6e6e73;">WhatsApp</td><td style="padding:0 20px 16px 20px;font-size:14px;color:#1d1d1f;text-align:right;">${safeWhats}</td></tr>
    </table>
    <p style="margin:16px 0 8px 0;font-size:14px;color:#6e6e73;">O aluno pode entrar em contato com você a qualquer momento. Se quiser puxar conversa primeiro, use os canais acima.</p>
    <div style="margin:28px 0 8px 0;padding:20px;background-color:#f5f5f7;border:1px solid rgba(0,0,0,0.08);border-radius:10px;">
      <p style="margin:0 0 12px 0;font-size:14px;color:#1d1d1f;"><strong>Já fechou negócio?</strong></p>
      <p style="margin:0 0 16px 0;font-size:13px;color:#6e6e73;line-height:1.55;">Clique no botão abaixo pra tirar a oportunidade do balcão imediatamente. Nenhum aluno novo consegue ver seus dados depois disso.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr><td align="center">
          <a href="${safeCloseUrl}" style="display:inline-block;padding:12px 24px;background:#1d1d1f;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Fechar oportunidade</a>
        </td></tr>
      </table>
    </div>
    <p style="margin:24px 0 0 0;color:#86868b;font-size:12px;">Se preferir manter a oportunidade publicada, é só ignorar esse email.</p>
  `;
  return send(params.contractorEmail, `Novo interesse: ${params.studentName}`, baseHtml("Novo interesse", body), params.studentEmail);
}

export async function sendInterestToStudent(params: {
  studentEmail: string;
  studentName: string;
  contractorName: string;
  opportunityNicho: string;
}): Promise<EmailResult> {
  const first = escapeHtml((params.studentName || "").split(" ")[0] ?? "");
  const safeContractor = escapeHtml(params.contractorName || "o contratante");
  const safeNicho = escapeHtml(params.opportunityNicho || "este nicho");

  const body = `
    <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:600;color:#1d1d1f;">Contato liberado, ${first}!</h1>
    <p style="margin:0 0 12px 0;">Você visualizou os dados de contato da oportunidade de <strong>${safeContractor}</strong> em <strong>${safeNicho}</strong>.</p>
    <p style="margin:0 0 12px 0;">O contratante também foi avisado que você se interessou. O próximo passo é seu: mande mensagem pelo WhatsApp ou email e apresente-se.</p>
    <p style="margin:24px 0 0 0;color:#6e6e73;font-size:13px;">Dica: seja direto, mostre cases relevantes e proponha uma conversa de 15 minutos. Boa sorte!</p>
  `;
  return send(params.studentEmail, "Contato liberado no Balcão dos Funis", baseHtml("Contato liberado", body));
}
