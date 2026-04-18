import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { GlowOrbs } from "@/components/layout/GlowOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api, ApiError } from "@/lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { session, eligibility } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const hasNoAccessFlag = new URLSearchParams(location.search).get("no_access") === "1";

  useEffect(() => {
    if (session && eligibility === "eligible") {
      navigate("/oportunidades", { replace: true });
    }
  }, [session, eligibility, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await api.requestAccess(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      const msg = err instanceof ApiError ? err.detail : "Algo deu errado. Tente novamente.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <GlowOrbs />
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="glass rounded-2xl p-8">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-fg hover:text-primary-fg">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Entrar no Balcão</h1>
          <p className="mt-2 text-sm text-secondary-fg">
            Enviamos um link mágico no seu email. Sem senha pra lembrar.
          </p>

          {hasNoAccessFlag && !sent && (
            <div
              className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200"
              role="alert"
            >
              O email com o qual você entrou não tem uma assinatura ativa nas comunidades elegíveis
              (Método LTV, CAIA, AI Society). Entre em contato com o suporte se achar que é engano.
            </div>
          )}

          {sent ? (
            <div className="mt-8 space-y-4">
              <div
                className="flex items-start gap-3 rounded-lg border p-4"
                style={{ borderColor: "var(--sigma-border)", background: "var(--sigma-bg)" }}
              >
                <Mail className="mt-0.5 shrink-0" size={18} style={{ color: "var(--sigma)" }} />
                <div className="text-sm text-secondary-fg">
                  Se houver uma assinatura ativa para <strong className="text-primary-fg">{email}</strong>, você
                  vai receber um link de acesso em instantes.
                </div>
              </div>
              <p className="text-xs text-muted-fg">
                Não encontrou? Cheque o spam. O link expira em 1 hora.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email da comunidade
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                  disabled={submitting}
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting || !email}
                className="h-11 w-full gap-2"
                style={{ background: "var(--sigma)", color: "white" }}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                {submitting ? "Enviando..." : "Enviar link de acesso"}
              </Button>
              <p className="text-xs text-muted-fg">
                Usamos o email que você cadastrou na compra do curso/mentoria.
              </p>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-fg">
          Não é aluno?{" "}
          <Link to="/publicar" className="text-sigma hover:underline" style={{ color: "var(--sigma)" }}>
            Publique uma oportunidade →
          </Link>
        </p>
      </div>
    </div>
  );
}
