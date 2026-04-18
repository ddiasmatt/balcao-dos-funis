import crypto from "node:crypto";

function secret(): string {
  const s = process.env.BALCAO_CLOSE_SECRET;
  if (!s || s.length < 32) {
    throw new Error("BALCAO_CLOSE_SECRET não configurada (mínimo 32 chars)");
  }
  return s;
}

export function signCloseToken(opportunityId: string): string {
  return crypto.createHmac("sha256", secret()).update(opportunityId).digest("hex");
}

export function verifyCloseToken(opportunityId: string, token: string): boolean {
  try {
    const expected = signCloseToken(opportunityId);
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(token, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
