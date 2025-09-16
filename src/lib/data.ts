// Interface para compatibilidade - agora dados vêm do Supabase
export interface Opportunity {
  id: string;
  nome: string;
  nicho: string;
  instagram: string;
  whatsapp_public: string;  // Ofuscated contact info for marketplace
  email_public: string;     // Ofuscated contact info for marketplace
  faturamento: string;
  como_ajudar: string;
  por_que_escolher: string;
  created_at: string;
  updated_at?: string;      // Added for RPC response compatibility
  public_contact_method?: string;
  contact_message?: string;
}

// Full opportunity interface for when user views their own data
export interface FullOpportunity extends Opportunity {
  whatsapp: string;         // Full contact info (own data only)
  email: string;            // Full contact info (own data only)
  user_id: string;
  show_full_contact: boolean;
}

// Mock data removido - dados agora vêm do Supabase via RPC

export const nichos = [
  "Todos",
  "Educação",
  "E-commerce", 
  "Saúde",
  "Tecnologia",
  "Consultoria"
];

// Função para formatear tempo relativo
export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'há poucos segundos';
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)}min`;
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)}h`;
  return `há ${Math.floor(diffInSeconds / 86400)}d`;
};