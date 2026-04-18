import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthCallback from "@/pages/AuthCallback";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OpportunityDetail from "@/pages/OpportunityDetail";
import Opportunities from "@/pages/Opportunities";
import Publish from "@/pages/Publish";
import PublishSuccess from "@/pages/PublishSuccess";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            theme="dark"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(18px)",
                color: "var(--foreground)",
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/publicar" element={<Publish />} />
            <Route path="/publicar/sucesso" element={<PublishSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/sair" element={<SignOutRedirect />} />

            <Route
              path="/oportunidades"
              element={
                <ProtectedRoute>
                  <Opportunities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/oportunidades/:id"
              element={
                <ProtectedRoute>
                  <OpportunityDetail />
                </ProtectedRoute>
              }
            />

            <Route path="/aplicar" element={<Navigate to="/publicar" replace />} />
            <Route path="/dashboard" element={<Navigate to="/oportunidades" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

import { supabase } from "@/lib/supabase";

function SignOutRedirect() {
  void supabase.auth.signOut();
  return <Navigate to="/" replace />;
}
