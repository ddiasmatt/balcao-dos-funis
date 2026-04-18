import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NICHES } from "@/lib/niches";

interface Props {
  nicho?: string;
  sort: string;
  q: string;
  onNicho: (value: string | undefined) => void;
  onSort: (value: string | undefined) => void;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

export function FilterBar({ nicho, sort, q, onNicho, onSort, onSearchChange, onSearchSubmit }: Props) {
  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center">
      <form
        className="relative flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
      >
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg"
        />
        <Input
          value={q}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nome, descrição..."
          className="h-11 pl-10"
        />
      </form>

      <div className="flex gap-3">
        <Select value={nicho ?? "all"} onValueChange={(v) => onNicho(v === "all" ? undefined : v)}>
          <SelectTrigger className="h-11 min-w-[160px]">
            <SelectValue placeholder="Todos os nichos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os nichos</SelectItem>
            {NICHES.map((n) => (
              <SelectItem key={n.slug} value={n.slug}>
                {n.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => onSort(v === "recent" ? undefined : v)}>
          <SelectTrigger className="h-11 min-w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais recentes</SelectItem>
            <SelectItem value="faturamento">Maior faturamento</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
