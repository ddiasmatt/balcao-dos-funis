import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, total, pageSize, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        disabled={!canPrev}
        onClick={() => onPageChange(page - 1)}
        className="gap-1 border-white/15 disabled:opacity-40"
      >
        <ChevronLeft size={14} /> Anterior
      </Button>

      <span className="text-sm text-secondary-fg">
        Página <span className="text-primary-fg">{page}</span> de {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={!canNext}
        onClick={() => onPageChange(page + 1)}
        className="gap-1 border-white/15 disabled:opacity-40"
      >
        Próxima <ChevronRight size={14} />
      </Button>
    </div>
  );
}
