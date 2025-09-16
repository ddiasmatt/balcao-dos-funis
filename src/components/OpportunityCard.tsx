import { Clock, Instagram, DollarSign, TrendingUp } from 'lucide-react';
import { Opportunity, getTimeAgo } from '@/lib/data';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: () => void;
}

export const OpportunityCard = ({ opportunity, onClick }: OpportunityCardProps) => {
  const getNichoBadgeColor = (nicho: string) => {
    const colors = {
      'Educação': 'bg-blue-500',
      'E-commerce': 'bg-green-500',
      'Saúde': 'bg-red-500',
      'Tecnologia': 'bg-purple-500',
      'Consultoria': 'bg-yellow-500'
    };
    return colors[nicho as keyof typeof colors] || 'bg-primary';
  };

  return (
    <div 
      className="ltv-card p-6 cursor-pointer group"
      onClick={onClick}
    >
      {/* Badge do Nicho */}
      <div className="flex justify-between items-start mb-4">
        <span className={`${getNichoBadgeColor(opportunity.nicho)} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}>
          {opportunity.nicho}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock size={12} />
          {getTimeAgo(opportunity.created_at)}
        </span>
      </div>

      {/* Nome */}
      <h3 className="ltv-title text-xl mb-2 group-hover:ltv-text-orange transition-colors">
        {opportunity.nome}
      </h3>

      {/* Instagram */}
      <div className="flex items-center gap-2 mb-3 text-muted-foreground">
        <Instagram size={16} />
        <span className="ltv-small">{opportunity.instagram}</span>
      </div>

      {/* Faturamento */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1 text-green-600">
          <DollarSign size={16} />
          <span className="font-semibold">{opportunity.faturamento}</span>
        </div>
      </div>

      {/* Preview da descrição */}
      <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden leading-5">
        {opportunity.como_ajudar.length > 100 
          ? opportunity.como_ajudar.substring(0, 100) + '...'
          : opportunity.como_ajudar
        }
      </p>

      {/* Call to action sutil */}
      <div className="flex items-center text-primary text-sm font-medium group-hover:underline">
        <TrendingUp size={14} className="mr-1" />
        Ver detalhes completos
      </div>
    </div>
  );
};