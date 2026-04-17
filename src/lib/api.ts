import { supabase } from "./supabase";

const API_URL = (import.meta.env.VITE_SIGMA_API_URL || "http://localhost:8000").replace(/\/$/, "");

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export class ApiError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (res.ok) {
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
  }

  let detail = `Erro ${res.status}`;
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") detail = body.detail;
    else if (Array.isArray(body?.detail)) detail = body.detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join(", ") || detail;
  } catch {
    /* ignore */
  }

  throw new ApiError(res.status, detail);
}

export async function apiGet<T>(path: string, opts: { auth?: boolean } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.auth !== false) Object.assign(headers, await authHeader());
  const res = await fetch(`${API_URL}${path}`, { headers });
  return handle<T>(res);
}

export async function apiPost<T>(path: string, body: unknown, opts: { auth?: boolean } = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth !== false) Object.assign(headers, await authHeader());
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return handle<T>(res);
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Niche {
  slug: string;
  label: string;
  description?: string | null;
}

export interface Opportunity {
  id: string;
  created_at: string;
  expires_at?: string | null;
  nome: string;
  nicho: string;
  nicho_slug?: string | null;
  instagram: string;
  faturamento: string;
  como_ajudar: string;
  por_que_escolher: string;
  contact_message?: string | null;
}

export interface OpportunityList {
  data: Opportunity[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface Me {
  email: string;
  name?: string | null;
  subscription_status: string;
  subscription_product_id: number;
}

// ─── Endpoints ──────────────────────────────────────────────────────────────

export const api = {
  requestAccess: (email: string) =>
    apiPost<{ ok: boolean; message: string }>("/api/balcao/auth/request-access", { email }, { auth: false }),

  me: () => apiGet<Me>("/api/balcao/me"),

  niches: () => apiGet<Niche[]>("/api/balcao/niches", { auth: false }),

  listOpportunities: (params: { page?: number; page_size?: number; nicho?: string; q?: string; sort?: string }) => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.page_size) qs.set("page_size", String(params.page_size));
    if (params.nicho) qs.set("nicho", params.nicho);
    if (params.q) qs.set("q", params.q);
    if (params.sort) qs.set("sort", params.sort);
    return apiGet<OpportunityList>(`/api/balcao/opportunities?${qs.toString()}`);
  },

  getOpportunity: (id: string) => apiGet<Opportunity>(`/api/balcao/opportunities/${id}`),

  submitOpportunity: (payload: Record<string, unknown>) =>
    apiPost<{ ok: boolean; id?: string }>("/api/balcao/opportunities", payload, { auth: false }),

  registerInterest: (id: string, message?: string) =>
    apiPost<{ ok: boolean; interest_id?: string }>(`/api/balcao/opportunities/${id}/interest`, { message }),
};
