import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Flame, LogOut, User, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityModal } from '@/components/OpportunityModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getTimeAgo, Opportunity } from '@/lib/data';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNicho, setSelectedNicho] = useState('Todos');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [nichos, setNichos] = useState<string[]>(['Todos']);

  // Fetch opportunities from Supabase
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        console.log('Calling RPC function: get_public_opportunities');
        
        // Use the RPC function for full opportunities data
        const { data, error } = await supabase
          .rpc('get_public_opportunities');

        console.log('Supabase query response:', { data, error });
        console.log('Data type:', typeof data, 'Data length:', data?.length);

        if (error) {
          console.error('Error fetching opportunities:', error);
          return;
        }

        if (data) {
          console.log('Setting opportunities:', data);
          // The RPC returns data in a different format, need to map it properly
          const mappedOpportunities = data.map((item: any) => ({
            id: item.id,
            nome: item.nome,
            nicho: item.nicho,
            instagram: item.instagram,
            whatsapp_public: item.whatsapp_public,
            email_public: item.email_public,
            faturamento: item.faturamento,
            como_ajudar: item.como_ajudar,
            por_que_escolher: item.por_que_escolher,
            created_at: item.created_at,
            updated_at: item.updated_at,
            public_contact_method: item.public_contact_method,
            contact_message: item.contact_message,
          }));
          
          console.log('Mapped opportunities:', mappedOpportunities);
          setOpportunities(mappedOpportunities as Opportunity[]);
          // Extract unique nichos from the data
          const uniqueNichos = ['Todos', ...new Set(mappedOpportunities.map((item: any) => item.nicho))];
          console.log('Setting nichos:', uniqueNichos);
          setNichos(uniqueNichos);
        }
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Filtrar oportunidades
  const filteredOpportunities = useMemo(() => {
    console.log('Filtering opportunities:', { opportunities, searchTerm, selectedNicho });
    
    const filtered = opportunities.filter(opportunity => {
      const matchesSearch = 
        opportunity.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.instagram.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.nicho.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesNicho = selectedNicho === 'Todos' || opportunity.nicho === selectedNicho;
      
      return matchesSearch && matchesNicho;
    });
    
    console.log('Filtered opportunities:', filtered);
    return filtered;
  }, [opportunities, searchTerm, selectedNicho]);

  const handleCardClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOpportunity(null);
  };

  const getUserDisplayName = (email: string) => {
    return email.split('@')[0];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Fixo */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="ltv-bg-orange p-2 rounded-lg">
              <Flame size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">BALCÃO DOS FUNIS</h1>
              <p className="text-sm ltv-text-orange font-semibold">LTV TRIBE</p>
            </div>
          </div>

          {/* User Info e Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 ltv-text-gray">
              <User size={16} />
              <span className="ltv-small">Olá, {getUserDisplayName(user!)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-primary ltv-text-orange hover:bg-accent"
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Área principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Oportunidades</h2>
          <p className="text-muted-foreground">Explore as oportunidades disponíveis</p>
        </div>

        {/* Barra de busca e filtros */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          {/* Campo de busca */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Buscar oportunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          {/* Filtro por nicho */}
          <div className="sm:w-48">
            <Select value={selectedNicho} onValueChange={setSelectedNicho}>
              <SelectTrigger className="h-12">
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <SelectValue placeholder="Filtrar por nicho" />
                </div>
              </SelectTrigger>
              <SelectContent className="z-50">
                {nichos.map((nicho) => (
                  <SelectItem key={nicho} value={nicho}>
                    {nicho}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mb-6">
          <p className="ltv-text-gray ltv-small">
            {filteredOpportunities.length} oportunidade{filteredOpportunities.length !== 1 ? 's' : ''} encontrada{filteredOpportunities.length !== 1 ? 's' : ''}
            {selectedNicho !== 'Todos' && ` em ${selectedNicho}`}
          </p>
        </div>

        {/* Grid de oportunidades */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity as any}
                onClick={() => handleCardClick(opportunity)}
              />
            ))}
          </div>
        ) : (
          /* Estado vazio */
          <div className="text-center py-16">
            <div className="ltv-bg-orange-light p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search className="ltv-text-orange" size={32} />
            </div>
            <h3 className="ltv-subtitle mb-2">Nenhuma oportunidade encontrada</h3>
            <p className="ltv-text-gray">
              {searchTerm || selectedNicho !== 'Todos' 
                ? 'Tente ajustar seus filtros de busca'
                : 'Aguarde novas oportunidades em breve'
              }
            </p>
            {(searchTerm || selectedNicho !== 'Todos') && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedNicho('Todos');
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Modal de detalhes */}
      <OpportunityModal
        opportunity={selectedOpportunity as any}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Dashboard;