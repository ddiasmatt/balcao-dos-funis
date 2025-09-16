import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Users, BriefcaseIcon, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-3 rounded-lg shadow-lg">
              <Flame size={28} className="text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">BALCÃO DOS FUNIS</h1>
              <p className="text-sm text-primary font-semibold">LTV TRIBE</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Conectamos <span className="text-primary">Talentos</span> e <span className="text-primary">Oportunidades</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A plataforma que une especialistas em funis de vendas com empresas que buscam crescimento exponencial.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Card para Alunos */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center">
                <Users size={32} className="text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">Para Alunos</CardTitle>
              <CardDescription className="text-base">
                Acesse sua área exclusiva e explore oportunidades de trabalho
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Acesso a oportunidades exclusivas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Dashboard personalizado</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Acompanhamento de aplicações</span>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/login'}
                className="w-full text-lg py-6 group"
                size="lg"
              >
                Entrar como Aluno
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </CardContent>
          </Card>

          {/* Card para Contratantes */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center">
                <BriefcaseIcon size={32} className="text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">Para Contratantes</CardTitle>
              <CardDescription className="text-base">
                Publique sua vaga e encontre especialistas qualificados
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Processo de aplicação simplificado</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Acesso a talentos pré-qualificados</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Suporte especializado</span>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/aplicar'}
                variant="outline"
                className="w-full text-lg py-6 group border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                size="lg"
              >
                Postar uma Vaga
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Por que escolher o Balcão dos Funis?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                <CheckCircle size={28} className="text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Qualidade Garantida</h4>
              <p className="text-sm text-muted-foreground">
                Todos os profissionais são pré-qualificados e treinados pela LTV Tribe
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                <Users size={28} className="text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Rede Especializada</h4>
              <p className="text-sm text-muted-foreground">
                Comunidade focada em funis de vendas e growth marketing
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                <Flame size={28} className="text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Resultados Comprovados</h4>
              <p className="text-sm text-muted-foreground">
                Metodologia testada e aprovada por centenas de empresas
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;