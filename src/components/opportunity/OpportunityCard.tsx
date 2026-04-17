import { Instagram } from "lucide-react";

import type { Opportunity } from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <article className="glass group flex h-full flex-col rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide"
          style={{ background: "var(--sigma-bg)", color: "var(--sigma)" }}
        >
          {opportunity.nicho}
        </span>
        <span className="text-[11px] text-muted-fg">{formatRelativeTime(opportunity.created_at)}</span>
      </div>

      <h3 className="mt-4 line-clamp-2 text-lg font-semibold text-primary-fg">{opportunity.nome}</h3>
      <p className="mt-1 flex items-center gap-1 text-xs text-muted-fg">
        <Instagram size={12} />@{opportunity.instagram}
      </p>

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-secondary-fg">{opportunity.como_ajudar}</p>

      <div className="mt-auto pt-5">
        <div className="text-[10px] uppercase tracking-wider text-muted-fg">Faturamento</div>
        <div className="mt-0.5 text-sm font-medium text-primary-fg">{opportunity.faturamento}</div>
      </div>
    </article>
  );
}
