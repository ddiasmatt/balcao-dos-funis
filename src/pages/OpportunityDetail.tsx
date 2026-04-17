import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Instagram, MessageCircle } from "lucide-react";

import { InterestDialog } from "@/components/opportunity/InterestDialog";
import { GlowOrbs } from "@/components/layout/GlowOrbs";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: opp, isLoading, isError } = useQuery({
    queryKey: ["opportunity", id],
    queryFn: () => api.getOpportunity(id!),
    enabled: !!id,
  });

  return (
    <Shell>
      <div className="relative overflow-hidden">
        <GlowOrbs />
        <section className="container relative z-10 py-12">
          <Link
            to="/oportunidades"
            className="inline-flex items-center gap-2 text-sm text-muted-fg hover:text-primary-fg"
          >
            <ArrowLeft size={14} /> Voltar às oportunidades
          </Link>

          {isLoading ? (
            <div className="mt-8 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-6 h-40 w-full rounded-2xl" />
            </div>
          ) : isError || !opp ? (
            <div className="mt-16 text-center text-secondary-fg">Oportunidade não encontrada.</div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{ background: "var(--sigma-bg)", color: "var(--sigma)" }}
                  >
                    {opp.nicho}
                  </span>
                  <span className="text-xs text-muted-fg">{formatRelativeTime(opp.created_at)}</span>
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{opp.nome}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-secondary-fg">
                  <Instagram size={14} />@{opp.instagram}
                </p>

                <section className="mt-10 space-y-8">
                  <div>
                    <h2 className="text-sm font-medium uppercase tracking-wider text-muted-fg">
                      Como pode ajudar
                    </h2>
                    <p className="mt-2 whitespace-pre-line leading-relaxed text-primary-fg">
                      {opp.como_ajudar}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-sm font-medium uppercase tracking-wider text-muted-fg">
                      Por que te escolheria
                    </h2>
                    <p className="mt-2 whitespace-pre-line leading-relaxed text-primary-fg">
                      {opp.por_que_escolher}
                    </p>
                  </div>
                </section>
              </div>

              <aside>
                <div className="glass sticky top-24 rounded-2xl p-6">
                  <div className="text-xs uppercase tracking-wider text-muted-fg">Faturamento</div>
                  <div className="mt-1 text-xl font-semibold">{opp.faturamento}</div>

                  {opp.contact_message && (
                    <p className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-sm text-secondary-fg">
                      {opp.contact_message}
                    </p>
                  )}

                  <Button
                    size="lg"
                    onClick={() => setDialogOpen(true)}
                    className="mt-6 w-full gap-2"
                    style={{ background: "var(--sigma)", color: "white" }}
                  >
                    <MessageCircle size={16} /> Tenho interesse
                  </Button>
                  <p className="mt-3 text-xs text-muted-fg">
                    Enviamos seu contato direto por email. Sem exposição pública.
                  </p>
                </div>
              </aside>

              <InterestDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                opportunityId={opp.id}
                contractorName={opp.nome}
              />
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
}
