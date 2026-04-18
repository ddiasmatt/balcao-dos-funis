import { supabaseAdmin } from "./supabase";
import { sendMagicLinkEmail } from "./emails";

/**
 * Gera link de magic link via Supabase Admin API e dispara email branded pelo Resend.
 *
 * Por que não usar /auth/v1/otp direto: aquele endpoint faz o GoTrue mandar o email
 * pelo SMTP configurado no stack, que está com sender "Sigma Studio <noreply@sigma.vuker.com.br>".
 * O stack é compartilhado entre Sigma e Balcão — não dá pra mudar o sender global sem afetar
 * o Sigma. A admin API `generateLink` gera o action_link sem enviar email, aí o backend do
 * balcão manda o email com branding próprio via Resend (sender noreply@mail.ltvtribe.com.br).
 * A sessão continua sendo criada pelo GoTrue quando o usuário clica no link.
 */
export async function sendMagicLink(email: string): Promise<void> {
  const front = (process.env.BALCAO_FRONTEND_URL ?? "https://balcao.ltvtribe.com.br").replace(/\/$/, "");
  const redirectTo = `${front}/auth/callback`;

  const { data, error } = await supabaseAdmin().auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error || !data?.properties?.action_link) {
    console.error("generateLink failed", error);
    throw new Error("não foi possível gerar o link de acesso");
  }

  const result = await sendMagicLinkEmail(email, data.properties.action_link);
  if (!result.ok) {
    console.error("sendMagicLinkEmail failed for", email);
    throw new Error("falha ao enviar email com o link de acesso");
  }
}
