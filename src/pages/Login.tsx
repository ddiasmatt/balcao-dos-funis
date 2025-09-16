import { useState, useEffect } from 'react';
import { Mail, ArrowRight, Flame, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signInWithEmail, signUpWithEmail, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    
    try {
      let result;
      if (isSignUp) {
        result = await signUpWithEmail(email, password);
        if (!result.error) {
          toast({
            title: "Conta criada!",
            description: "Verifique seu email para confirmar a conta.",
          });
        }
      } else {
        result = await signInWithEmail(email, password);
        if (!result.error) {
          navigate('/dashboard');
        }
      }
      
      if (result.error) {
        toast({
          title: "Erro na autenticação",
          description: result.error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
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
          <div className="mb-6 flex justify-center">
            <div className="bg-muted rounded-lg p-1 flex">
              <Button
                type="button"
                variant={!isSignUp ? "default" : "ghost"}
                onClick={() => setIsSignUp(false)}
                className="px-6 py-2 text-sm"
              >
                Entrar
              </Button>
              <Button
                type="button"
                variant={isSignUp ? "default" : "ghost"}
                onClick={() => setIsSignUp(true)}
                className="px-6 py-2 text-sm"
              >
                Criar Conta
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Input Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="ltv-small text-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 text-base border-2 focus:border-primary"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
            </div>

            {/* Botão de Submit */}
            <Button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="w-full h-12 ltv-gradient text-white font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isSignUp ? 'Criando conta...' : 'Acessando...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isSignUp ? 'CRIAR CONTA' : 'ACESSAR AGORA'}
                  <ArrowRight size={20} />
                </div>
              )}
            </Button>
          </form>

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