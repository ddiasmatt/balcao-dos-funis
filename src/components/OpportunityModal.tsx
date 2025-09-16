import { X, Instagram, DollarSign, MessageCircle, Mail, Phone, Target, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Opportunity } from '@/lib/data';
import { useEffect } from 'react';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OpportunityModal = ({ opportunity, isOpen, onClose }: OpportunityModalProps) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !opportunity) return null;

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

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Olá ${opportunity.nome}! Vim através do Balcão dos Funis - LTV Tribe e tenho interesse em ajudar com seu projeto. Podemos conversar?`
    );
    window.open(`https://wa.me/${opportunity.whatsapp_public.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent(`Oportunidade via Balcão dos Funis - ${opportunity.nome}`);
    const body = encodeURIComponent(
      `Olá ${opportunity.nome}!\n\nVim através do Balcão dos Funis - LTV Tribe e tenho interesse em ajudar com seu projeto.\n\nGostaria de agendar uma conversa para entendermos melhor como posso contribuir.\n\nAguardo seu retorno!\n\nAtenciosamente`
    );
    window.open(`mailto:${opportunity.email_public}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ltv-modal animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className={`${getNichoBadgeColor(opportunity.nicho)} text-white px-3 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide`}>
                {opportunity.nicho}
              </span>
              <h2 className="ltv-title text-2xl">{opportunity.nome}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ltv-text-orange hover:bg-accent"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Info básica */}
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <div className="flex items-center gap-2 ltv-text-gray">
              <Instagram size={16} />
              <span>{opportunity.instagram}</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <DollarSign size={16} />
              <span className="font-semibold">{opportunity.faturamento}</span>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Como podemos ajudar */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="ltv-text-orange" size={20} />
              <h3 className="ltv-subtitle">Como podemos ajudar:</h3>
            </div>
            <div className="bg-accent p-4 rounded-lg">
              <p className="ltv-body">{opportunity.como_ajudar}</p>
            </div>
          </div>

          {/* Por que escolher */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="ltv-text-orange" size={20} />
              <h3 className="ltv-subtitle">Por que escolher este projeto:</h3>
            </div>
            <div className="bg-accent p-4 rounded-lg">
              <p className="ltv-body">{opportunity.por_que_escolher}</p>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t pt-6">
            <h3 className="ltv-subtitle text-center mb-4">Entre em Contato</h3>
            
            {/* Botões de contato */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button
                onClick={handleWhatsAppClick}
                className="flex-1 ltv-gradient text-white hover:opacity-90 transition-opacity"
                size="lg"
              >
                <MessageCircle size={20} className="mr-2" />
                WhatsApp
              </Button>
              
              <Button
                onClick={handleEmailClick}
                variant="outline"
                className="flex-1 border-primary ltv-text-orange hover:bg-accent"
                size="lg"
              >
                <Mail size={20} className="mr-2" />
                Email
              </Button>
            </div>

            {/* Info de contato */}
            <div className="text-center space-y-2 ltv-text-gray ltv-small">
              <div className="flex items-center justify-center gap-2">
                <Phone size={14} />
                <span>{opportunity.whatsapp_public}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail size={14} />
                <span className="break-all">{opportunity.email_public}</span>
              </div>
              {opportunity.contact_message && (
                <div className="mt-3 p-3 bg-accent/50 rounded-lg">
                  <p className="ltv-small text-center">{opportunity.contact_message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};