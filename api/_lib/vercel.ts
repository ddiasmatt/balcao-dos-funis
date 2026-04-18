import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AuthError } from "./auth.js";

export type Handler = (req: VercelRequest, res: VercelResponse) => Promise<void> | void;

/**
 * Wrapper central com:
 * - Valida HTTP method (retorna 405 se não permitido)
 * - Captura AuthError → 401/403
 * - Captura erros genéricos → 500 (log)
 */
export function route(methods: string[], handler: Handler): Handler {
  return async (req, res) => {
    if (!methods.includes(req.method ?? "")) {
      res.setHeader("Allow", methods.join(", "));
      return res.status(405).json({ detail: "Method Not Allowed" });
    }
    try {
      await handler(req, res);
    } catch (err) {
      if (err instanceof AuthError) {
        return res.status(err.status).json({ detail: err.message });
      }
      console.error("unhandled route error", err);
      if (!res.headersSent) res.status(500).json({ detail: "Erro interno. Tente novamente." });
    }
  };
}

export function clientIpFromReq(req: VercelRequest): string {
  const fwd = (req.headers["x-forwarded-for"] as string | undefined) ?? "";
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers["x-real-ip"] as string | undefined;
  if (real) return real.trim();
  return (req.socket as { remoteAddress?: string } | undefined)?.remoteAddress ?? "unknown";
}

export function getAuthHeader(req: VercelRequest): string | undefined {
  const h = req.headers.authorization;
  if (!h) return undefined;
  return Array.isArray(h) ? h[0] : h;
}
