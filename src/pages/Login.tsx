import { useState } from 'react';
import { Mail, ArrowRight, Flame, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Enviar para ambos os endpoints N8N
      const endpoints = [
        'https://n8n.ltvtribe.com.br/webhook-test/642ddadb-526e-43a3-93fd-2878c9ef55a7',
        'https://n8n.ltvtribe.com.br/webhook/642ddadb-526e-43a3-93fd-2878c9ef55a7'
      ];

      const requests = endpoints.map(url =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })
      );

      const responses = await Promise.all(requests);
      
      // Verificar se pelo menos uma das respostas é válida
      let isAuthenticated = false;
      
      for (const response of responses) {
        if (response.ok) {
          try {
            const data = await response.json();
            if (data.status === "true") {
              isAuthenticated = true;
              break;
            }
          } catch (error) {
            // Se não conseguir fazer parse do JSON, considera como falha
            console.error('Erro ao processar resposta:', error);
          }
        }
      }

      if (isAuthenticated) {
        login(email);
        navigate('/dashboard');
      } else {
        setError('Acesso negado. Entre em contato com o suporte para liberação do acesso.');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setError('Erro de conexão. Tente novamente ou entre em contato com o suporte.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ltv-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="ltv-bg-orange p-3 rounded-full">
              <Flame size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="ltv-title text-center mb-2">
            <span className="text-foreground">BALCÃO</span>
          </h1>
          <h1 className="ltv-title text-center mb-2">
            <span className="text-foreground">DOS FUNIS</span>
          </h1>
          <h2 className="ltv-subtitle ltv-text-orange">
            LTV TRIBE
          </h2>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-border">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Input Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="ltv-small text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 text-base border-2 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Botão de Login */}
            <Button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full h-12 ltv-gradient text-white font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Acessando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  ACESSAR AGORA
                  <ArrowRight size={20} />
                </div>
              )}
            </Button>
          </form>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5" size={20} />
                <div className="text-sm">
                  <p className="text-red-800 font-medium mb-2">{error}</p>
                  <div className="text-red-700 space-y-1">
                    <p>📱 WhatsApp: <span className="font-medium">+55 45 99852-1679</span></p>
                    <p>📧 Email: <span className="font-medium">suporte@ltvtribe.com.br</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Texto inferior */}
          <div className="mt-6 text-center">
            <p className="ltv-small ltv-text-gray italic">
              ✨ Acesso exclusivo para
            </p>
            <p className="ltv-small ltv-text-gray italic">
              membros LTV Tribe
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs ltv-text-gray">
            © 2025 LTV Tribe - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;