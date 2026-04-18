import { supabaseAnonHeaders, supabaseUrl } from "./supabase";

/**
 * Dispara magic link via GoTrue /auth/v1/otp.
 * Email sai pelo SMTP Resend já configurado no GoTrue do sigma-supa.
 */
export async function sendMagicLink(email: string): Promise<void> {
  const front = (process.env.BALCAO_FRONTEND_URL ?? "https://app.ltvtribe.com.br").replace(/\/$/, "");
  const redirectTo = `${front}/auth/callback`;

  const r = await fetch(`${supabaseUrl()}/auth/v1/otp`, {
    method: "POST",
    headers: supabaseAnonHeaders(),
    body: JSON.stringify({
      email,
      create_user: true,
      options: { email_redirect_to: redirectTo },
    }),
  });

  if (![200, 204].includes(r.status)) {
    console.warn("magic-link GoTrue status", r.status, (await r.text()).slice(0, 300));
  }
}
