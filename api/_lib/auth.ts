import { allowedProductIds, supabaseAdmin, supabaseAnonHeaders, supabaseUrl } from "./supabase";

export interface AuthUser {
  user_id: string;
  email: string;
}

export interface Prospect {
  id: number;
  email: string;
  name: string | null;
  phone: number | null;
  organization_id: string;
}

export interface ActiveSubscription {
  id: number;
  prospect_id: number;
  product_id: number;
  status: string;
  billing_period: string | null;
  next_billing_date: string | null;
  organization_id: string;
}

export interface StudentCtx {
  user: AuthUser;
  prospect: Prospect;
  subscription: ActiveSubscription;
}

export class AuthError extends Error {
  status: 401 | 403;
  constructor(status: 401 | 403, message: string) {
    super(message);
    this.status = status;
  }
}

async function validateJwt(token: string): Promise<AuthUser> {
  const r = await fetch(`${supabaseUrl()}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, ...supabaseAnonHeaders() },
  });
  if (!r.ok) throw new AuthError(401, "Token inválido ou expirado");
  const data = (await r.json()) as { id?: string; email?: string };
  if (!data.id) throw new AuthError(401, "Resposta inesperada do Auth");
  return { user_id: data.id, email: data.email ?? "" };
}

export async function requireUser(authHeader: string | undefined): Promise<AuthUser> {
  const h = authHeader ?? "";
  if (!h.toLowerCase().startsWith("bearer ")) {
    throw new AuthError(401, "Missing Authorization header");
  }
  const token = h.slice(7).trim();
  if (!token) throw new AuthError(401, "Empty Bearer token");
  return validateJwt(token);
}

export async function findProspectByEmail(email: string): Promise<Prospect | null> {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) return null;
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from("prospects")
    .select("id,email,name,phone,organization_id")
    .eq("email", normalized)
    .limit(1);
  if (error) throw new Error(`findProspectByEmail: ${error.message}`);
  return (data?.[0] as Prospect) ?? null;
}

export async function findActiveSubscription(prospectId: number): Promise<ActiveSubscription | null> {
  const products = allowedProductIds();
  if (products.length === 0) return null;
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from("prospects_subscriptions")
    .select("id,prospect_id,product_id,status,billing_period,next_billing_date,organization_id")
    .eq("prospect_id", prospectId)
    .eq("status", "active")
    .in("product_id", products)
    .limit(1);
  if (error) throw new Error(`findActiveSubscription: ${error.message}`);
  return (data?.[0] as ActiveSubscription) ?? null;
}

export async function requireStudent(authHeader: string | undefined): Promise<StudentCtx> {
  const user = await requireUser(authHeader);
  const email = (user.email ?? "").trim().toLowerCase();
  if (!email) throw new AuthError(401, "JWT sem email");
  const prospect = await findProspectByEmail(email);
  if (!prospect) throw new AuthError(403, "Acesso restrito a alunos com assinatura ativa.");
  const sub = await findActiveSubscription(prospect.id);
  if (!sub) throw new AuthError(403, "Sua assinatura não está ativa ou não dá acesso ao Balcão.");
  return { user, prospect, subscription: sub };
}
