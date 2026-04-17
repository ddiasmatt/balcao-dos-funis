import { useNavigate } from "react-router-dom";

import { GlowOrbs } from "@/components/layout/GlowOrbs";
import { Shell } from "@/components/layout/Shell";
import { PublishForm } from "@/components/publish/PublishForm";

export default function Publish() {
  const navigate = useNavigate();
  return (
    <Shell>
      <div className="relative overflow-hidden">
        <GlowOrbs />
        <section className="container relative z-10 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Publicar oportunidade</h1>
              <p className="mx-auto mt-3 max-w-lg text-secondary-fg">
                Preencha os campos abaixo. Sua oportunidade vai aparecer para os alunos das comunidades
                e fica ativa por 60 dias.
              </p>
            </div>

            <div className="glass mt-10 rounded-2xl p-6 sm:p-8">
              <PublishForm onSuccess={() => navigate("/publicar/sucesso")} />
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
