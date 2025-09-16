import { useState, useMemo } from 'react';
import { Search, Filter, Flame, LogOut, User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityModal } from '@/components/OpportunityModal';
import { useAuth } from '@/contexts/AuthContext';
import { opportunities, nichos, Opportunity } from '@/lib/data';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNicho, setSelectedNicho] = useState('Todos');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar oportunidades
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opportunity => {
      const matchesSearch = 
        opportunity.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.instagram.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.nicho.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesNicho = selectedNicho === 'Todos' || opportunity.nicho === selectedNicho;
      
      return matchesSearch && matchesNicho;
    });
  }, [searchTerm, selectedNicho]);

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
        {/* Header com botão de aplicar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Oportunidades</h2>
            <p className="text-muted-foreground">Explore as oportunidades disponíveis</p>
          </div>
          <Button
            onClick={() => navigate('/aplicar')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus size={16} className="mr-2" />
            Nova Aplicação
          </Button>
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
        {filteredOpportunities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
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
        opportunity={selectedOpportunity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Dashboard;