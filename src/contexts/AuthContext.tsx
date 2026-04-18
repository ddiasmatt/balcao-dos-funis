import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { api, ApiError, type Me } from "@/lib/api";
import { supabase } from "@/lib/supabase";

type EligibilityState = "unknown" | "checking" | "eligible" | "not_eligible";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  me: Me | null;
  loading: boolean;
  eligibility: EligibilityState;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Me | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityState>("unknown");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (!newSession) {
        setMe(null);
        setEligibility("unknown");
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setMe(null);
      setEligibility("unknown");
      return;
    }

    let cancelled = false;
    setEligibility("checking");
    api
      .me()
      .then((data) => {
        if (cancelled) return;
        setMe(data);
        setEligibility("eligible");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 403) {
          setEligibility("not_eligible");
          setMe(null);
        } else {
          setEligibility("unknown");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setMe(null);
    setEligibility("unknown");
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        me,
        loading,
        eligibility,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
