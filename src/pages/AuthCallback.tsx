import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";

import { GlowOrbs } from "@/components/layout/GlowOrbs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "ok" | "error">("checking");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // supabase-js detecta automaticamente tokens em # ou ? via detectSessionInUrl
      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;

      if (error) {
        setState("error");
        setMessage(error.message);
        return;
      }

      if (!data.session) {
        const hashErr = new URLSearchParams(window.location.hash.replace("#", "?")).get("error_description");
        setState("error");
        setMessage(hashErr || "Link inválido ou expirado. Peça um novo link.");
        return;
      }

      setState("ok");
      // limpa fragmentos da URL
      window.history.replaceState({}, document.title, "/oportunidades");
      navigate("/oportunidades", { replace: true });
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <GlowOrbs />
      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-2xl p-8 text-center">
          {state === "checking" && (
            <>
              <Loader2 className="mx-auto animate-spin" size={32} style={{ color: "var(--sigma)" }} />
              <h1 className="mt-4 text-xl font-semibold">Entrando...</h1>
              <p className="mt-2 text-sm text-secondary-fg">Validando seu link de acesso.</p>
            </>
          )}
          {state === "error" && (
            <>
              <AlertCircle className="mx-auto text-red-400" size={32} />
              <h1 className="mt-4 text-xl font-semibold">Link inválido</h1>
              <p className="mt-2 text-sm text-secondary-fg">{message}</p>
              <Button asChild className="mt-6" style={{ background: "var(--sigma)", color: "white" }}>
                <Link to="/login">Voltar ao login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
