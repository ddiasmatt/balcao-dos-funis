import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import { GlowOrbs } from "@/components/layout/GlowOrbs";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";

export default function PublishSuccess() {
  return (
    <Shell>
      <div className="relative overflow-hidden">
        <GlowOrbs />
        <section className="container relative z-10 py-24">
          <div className="mx-auto max-w-xl text-center">
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
            >
              <CheckCircle2 size={28} />
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Oportunidade publicada!
            </h1>
            <p className="mt-4 text-secondary-fg">
              Acabamos de enviar um email de confirmação. Sua oportunidade já está visível
              para os alunos.
            </p>
            <p className="mt-2 text-secondary-fg">
              Quando alguém se interessar, você recebe o contato dele direto na sua caixa.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="outline" className="border-white/15 hover:bg-white/5">
                <Link to="/">Voltar à home</Link>
              </Button>
              <Button asChild style={{ background: "var(--sigma)", color: "white" }}>
                <Link to="/publicar">Publicar outra</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
