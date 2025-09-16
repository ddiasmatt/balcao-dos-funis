// Interface para compatibilidade - agora dados vêm do Supabase
export interface Opportunity {
  id: string;
  nome: string;
  nicho: string;
  instagram: string;
  whatsapp: string;
  email: string;
  faturamento: string;
  como_ajudar: string;
  por_que_escolher: string;
  created_at: string;
}

export const opportunities: Opportunity[] = [
  {
    id: "1",
    nome: "Bruno Thorpe",
    nicho: "Educação",
    instagram: "@pulseventos",
    whatsapp: "+5581994720973",
    email: "institutopulse@gmail.com",
    faturamento: "R$ 50.000,00",
    como_ajudar: "Gostaria de criar funil de automação para o meu Instagram e outras ferramentas. Caso seja possível implantar o atendimento de IA no meu WhatsApp também",
    por_que_escolher: "Preciso delegar para quem tem mais experiência, tô sobrecarregado nas demandas e preciso avançar com isso",
    created_at: "2025-09-16T22:22:00Z"
  },
  {
    id: "2",
    nome: "Gisele Maria de Sousa",
    nicho: "Educação",
    instagram: "@ibesbrasil.mestrado",
    whatsapp: "+5533998800920",
    email: "institutobrasileiro@gmail.com",
    faturamento: "12 mil",
    como_ajudar: "captar alunos",
    por_que_escolher: "O negocio, onde oferecemos mestrado e doutorado feitos no paraguai e reconhecidos no brasil com nosso acompanhamento documental, é verdadeiramente o melhor do brasil, so precisa ser mais divulgado",
    created_at: "2025-09-16T20:15:00Z"
  },
  {
    id: "3",
    nome: "Carlos Mendes",
    nicho: "E-commerce",
    instagram: "@lojavirtual_pro",
    whatsapp: "+5511987654321",
    email: "carlos@ecommercepro.com",
    faturamento: "R$ 100.000,00",
    como_ajudar: "Automatizar processo de vendas e criar funis de captação para nossa loja virtual de produtos fitness",
    por_que_escolher: "Crescemos 300% no último ano mas estamos perdendo clientes por falta de automação eficiente",
    created_at: "2025-09-16T18:30:00Z"
  },
  {
    id: "4",
    nome: "Dra. Maria Silva",
    nicho: "Saúde",
    instagram: "@consultoriamedica",
    whatsapp: "+5521999888777",
    email: "dra.maria@consultoriamedica.com.br",
    faturamento: "R$ 200.000,00",
    como_ajudar: "Estruturar funil de consultoria médica online e automatizar agendamentos de teleconsultas",
    por_que_escolher: "Referência na área dermatológica com mais de 15 anos de experiência, precisamos digitalizar nossos processos",
    created_at: "2025-09-16T16:45:00Z"
  },
  {
    id: "5",
    nome: "Roberto Costa",
    nicho: "Tecnologia",
    instagram: "@devtech_solutions",
    whatsapp: "+5548991234567",
    email: "roberto@devtech.com.br",
    faturamento: "R$ 75.000,00",
    como_ajudar: "Criar estratégia de marketing digital para captação de clientes B2B na área de desenvolvimento de software",
    por_que_escolher: "Startup em crescimento com produtos inovadores, mas precisamos melhorar nossa presença digital",
    created_at: "2025-09-16T14:20:00Z"
  },
  {
    id: "6",
    nome: "Ana Paula Oliveira",
    nicho: "Consultoria",
    instagram: "@consultoriarh_pro",
    whatsapp: "+5531987654321",
    email: "ana@consultoriarh.com.br",
    faturamento: "R$ 150.000,00",
    como_ajudar: "Desenvolver funis para captação de empresas que precisam de consultoria em RH e gestão de pessoas",
    por_que_escolher: "Mais de 20 anos de experiência em RH corporativo, mas preciso escalar meus serviços digitalmente",
    created_at: "2025-09-16T12:15:00Z"
  }
];

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