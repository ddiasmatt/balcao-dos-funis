import { Link, NavLink } from "react-router-dom";
import { LogOut, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function Header() {
  const { session, me, signOut, eligibility } = useAuth();
  const isStudent = eligibility === "eligible" && session;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-md" style={{ background: "rgba(12,12,16,0.7)" }}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, #7c6fff 0%, #4d9cff 100%)" }}
          >
            <Sparkles size={16} className="text-white" />
          </span>
          <span className="text-primary-fg">Balcão dos Funis</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          {isStudent ? (
            <>
              <NavLink
                to="/oportunidades"
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    isActive ? "text-primary-fg" : "text-muted-fg hover:text-primary-fg",
                  )
                }
              >
                Oportunidades
              </NavLink>
              <span className="hidden sm:inline text-sm text-muted-fg">{me?.name?.split(" ")[0] ?? me?.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                <LogOut size={14} /> Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/publicar">Publicar oportunidade</Link>
              </Button>
              <Button size="sm" asChild style={{ background: "var(--sigma)", color: "white" }}>
                <Link to="/login">Sou aluno</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
