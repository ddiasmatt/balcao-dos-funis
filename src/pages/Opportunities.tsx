import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

import { FilterBar } from "@/components/opportunity/FilterBar";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import { Pagination } from "@/components/opportunity/Pagination";
import { GlowOrbs } from "@/components/layout/GlowOrbs";
import { Shell } from "@/components/layout/Shell";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export default function Opportunities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const nicho = searchParams.get("nicho") || undefined;
  const q = searchParams.get("q") || undefined;
  const sort = searchParams.get("sort") || "recent";
  const [localSearch, setLocalSearch] = useState(q ?? "");

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["opportunities", page, nicho, q, sort],
    queryFn: () => api.listOpportunities({ page, page_size: 20, nicho, q, sort }),
    placeholderData: (prev) => prev,
  });

  const updateParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, value);
    }
    if (!("page" in patch)) next.delete("page");
    setSearchParams(next, { replace: true });
  };

  return (
    <Shell>
      <div className="relative overflow-hidden">
        <GlowOrbs />
        <section className="container relative z-10 py-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Oportunidades</h1>
              <p className="mt-1 text-sm text-secondary-fg">
                {data && `${data.total} ${data.total === 1 ? "oportunidade ativa" : "oportunidades ativas"}`}
                {!data && "Carregando..."}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <FilterBar
              nicho={nicho}
              sort={sort}
              q={localSearch}
              onNicho={(value) => updateParams({ nicho: value })}
              onSort={(value) => updateParams({ sort: value })}
              onSearchChange={setLocalSearch}
              onSearchSubmit={() => updateParams({ q: localSearch.trim() || undefined })}
            />
          </div>

          {isLoading && !data ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="mt-16 text-center text-red-300">
              Erro ao carregar oportunidades. Atualize a página.
            </div>
          ) : data && data.data.length === 0 ? (
            <div className="mt-16 text-center text-secondary-fg">
              Nenhuma oportunidade encontrada com esses filtros.
              <div className="mt-4">
                <button
                  onClick={() => setSearchParams({})}
                  className="text-sm underline"
                  style={{ color: "var(--sigma)" }}
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                style={{ opacity: isFetching ? 0.6 : 1, transition: "opacity 150ms" }}
              >
                {data!.data.map((opp) => (
                  <Link key={opp.id} to={`/oportunidades/${opp.id}`}>
                    <OpportunityCard opportunity={opp} />
                  </Link>
                ))}
              </div>

              {data!.total > data!.page_size && (
                <div className="mt-10">
                  <Pagination
                    page={page}
                    total={data!.total}
                    pageSize={data!.page_size}
                    onPageChange={(p) => updateParams({ page: p === 1 ? undefined : String(p) })}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </Shell>
  );
}
