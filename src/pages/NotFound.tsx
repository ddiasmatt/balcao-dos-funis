import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { GlowOrbs } from "@/components/layout/GlowOrbs";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <GlowOrbs />
      <div className="relative z-10 text-center">
        <div className="text-7xl font-bold tracking-tight text-sigma" style={{ color: "var(--sigma)" }}>
          404
        </div>
        <h1 className="mt-4 text-2xl font-semibold">Página não encontrada</h1>
        <p className="mx-auto mt-2 max-w-sm text-secondary-fg">
          A página que você procurou não existe ou foi movida.
        </p>
        <Button asChild className="mt-8 gap-2" style={{ background: "var(--sigma)", color: "white" }}>
          <Link to="/">
            <ArrowLeft size={16} /> Voltar ao início
          </Link>
        </Button>
      </div>
    </div>
  );
}
