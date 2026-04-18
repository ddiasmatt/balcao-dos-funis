import type { Niche } from "./api";

// Source of truth no banco: tabela `balcao_niches`
// (migration `app/supabase/migrations/20260416120002_balcao_niches.sql`).
// Lista espelhada aqui para render instantâneo dos selects.
// Atualizar manualmente quando a tabela mudar.
export const NICHES: Niche[] = [
  { slug: "trafego-pago", label: "Tráfego Pago", description: "Gestor de Meta Ads, Google Ads, TikTok Ads" },
  { slug: "cs-fullstack", label: "CS Full-stack", description: "Customer Success / Onboarding / Retenção" },
  { slug: "vendas", label: "Vendas", description: "Closer, SDR, vendas high-ticket" },
  { slug: "copywriting", label: "Copywriting", description: "Copy de lançamento, VSL, email marketing" },
  { slug: "dev", label: "Desenvolvimento", description: "Front-end, back-end, full-stack" },
  { slug: "design", label: "Design", description: "Design gráfico, UI/UX, identidade visual" },
  { slug: "gestao", label: "Gestão / Operações", description: "Gestor de projeto, COO, head operacional" },
  { slug: "conteudo", label: "Conteúdo", description: "Roteiro, social media, produção de conteúdo" },
  { slug: "edicao-video", label: "Edição de Vídeo", description: "Editor de reels, shorts, long-form" },
  { slug: "automacao-ia", label: "Automação / IA", description: "n8n, Make, agentes de IA, Claude/OpenAI" },
  { slug: "outros", label: "Outros", description: "Não se encaixa nas categorias acima" },
];
