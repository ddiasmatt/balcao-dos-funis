import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, CheckCircle2, Shield, Users } from "lucide-react";
import gsap from "gsap";

import { GlowOrbs } from "@/components/layout/GlowOrbs";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Só alunos ativos",
    body: "Quem vê as oportunidades são pessoas formadas nas comunidades. Curadoria via assinatura, não perfil público.",
  },
  {
    icon: Shield,
    title: "Contato protegido",
    body: "Aluno clica em 'tenho interesse' e só então o contratante recebe os dados dele por email. Nada exposto publicamente.",
  },
  {
    icon: Briefcase,
    title: "Contratação direta",
    body: "Nada de taxa de intermediação. A conversa acontece direto entre contratante e aluno.",
  },
];

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero]", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <Shell>
      <div className="relative overflow-hidden">
        <GlowOrbs />

        <section ref={heroRef} className="container relative z-10 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div
              data-hero
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs tracking-wide text-secondary-fg"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sigma" />
              Marketplace interno · Método LTV · CAIA · AI Society
            </div>

            <h1 data-hero className="mt-8 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              <span className="gradient-text">Oportunidades</span>
              <br />
              para quem tem <span className="text-sigma">a skill.</span>
            </h1>

            <p data-hero className="mx-auto mt-6 max-w-xl text-lg text-secondary-fg">
              O Balcão dos Funis é onde empresas e operadores publicam vagas, projetos e freelas direto
              para os alunos das comunidades. Sem ruído, sem intermediário.
            </p>

            <div data-hero className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild style={{ background: "var(--sigma)", color: "white" }} className="gap-2">
                <Link to="/login">
                  Sou aluno, ver oportunidades <ArrowRight size={16} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/15 hover:bg-white/5">
                <Link to="/publicar">Publicar oportunidade</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container relative z-10 pb-24">
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: "var(--sigma-bg)", color: "var(--sigma)" }}
                >
                  <f.icon size={18} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-primary-fg">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary-fg">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container relative z-10 pb-24">
          <div className="glass rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Tem um projeto ou vaga?
                </h2>
                <p className="mt-3 text-secondary-fg">
                  Publique em menos de 2 minutos. Só paga se contratar, sem taxa de publicação.
                  Os alunos que tiverem interesse aparecem no seu email.
                </p>
                <ul className="mt-5 grid gap-2 text-sm text-secondary-fg">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: "var(--sigma)" }} />
                    Alcança alunos com skills validadas em ICP certo
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: "var(--sigma)" }} />
                    Oportunidade fica ativa 60 dias, depois expira
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: "var(--sigma)" }} />
                    Recebe contato do aluno interessado direto por email
                  </li>
                </ul>
              </div>

              <Button size="lg" asChild style={{ background: "var(--sigma)", color: "white" }} className="gap-2 shrink-0">
                <Link to="/publicar">
                  Publicar oportunidade <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
