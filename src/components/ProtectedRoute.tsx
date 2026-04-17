import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading, eligibility } = useAuth();
  const location = useLocation();

  if (loading || eligibility === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sigma border-t-transparent" aria-label="Carregando" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (eligibility === "not_eligible") {
    return <Navigate to="/login?no_access=1" replace />;
  }

  return <>{children}</>;
}
