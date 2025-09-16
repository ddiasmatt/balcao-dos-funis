import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Flame, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { nichos } from '@/lib/data';

const applicationSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  nicho: z.string().min(1, 'Selecione um nicho'),
  instagram: z.string().min(1, 'Instagram é obrigatório'),
  whatsapp: z.string().min(1, 'WhatsApp é obrigatório'),
  email: z.string().email('Email inválido'),
  faturamento: z.string().min(1, 'Faturamento é obrigatório'),
  como_ajudar: z.string().min(10, 'Descreva como podemos ajudar (mínimo 10 caracteres)'),
  por_que_escolher: z.string().min(10, 'Explique por que escolher este projeto (mínimo 10 caracteres)'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const Application = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      nome: '',
      nicho: '',
      instagram: '',
      whatsapp: '',
      email: '',
      faturamento: '',
      como_ajudar: '',
      por_que_escolher: '',
    },
  });

  const filteredNichos = nichos.filter(nicho => nicho !== 'Todos');

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('balcao_opportunities')
        .insert({
          user_id: data.email, // Usar email como identificador já que não há auth
          ...data,
        });

      if (error) throw error;

      toast({
        title: "Aplicação enviada com sucesso!",
        description: "Em breve entraremos em contato através do email informado.",
      });

      // Limpar formulário após sucesso
      form.reset();
    } catch (error) {
      console.error('Erro ao enviar aplicação:', error);
      toast({
        title: "Erro ao enviar aplicação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Flame size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">APLICAÇÃO PARA CONTRATANTES</h1>
              <p className="text-sm text-primary font-semibold">BALCÃO DOS FUNIS</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-border p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Solicite uma Parceria
            </h2>
            <p className="text-muted-foreground text-lg">
              Preencha o formulário abaixo para que possamos avaliar sua oportunidade de negócio.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Informações Básicas */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground border-b pb-2">
                  Informações Básicas
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nicho"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nicho *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu nicho de atuação" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground border-b pb-2">
                  Informações de Contato
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp *</FormLabel>
                        <FormControl>
                          <Input placeholder="+55 11 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram *</FormLabel>
                        <FormControl>
                          <Input placeholder="@seuinstagram" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Informações do Negócio */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground border-b pb-2">
                  Informações do Negócio
                </h3>
                <FormField
                  control={form.control}
                  name="faturamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faturamento mensal atual *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: R$ 50.000,00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Detalhes do Projeto */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground border-b pb-2">
                  Detalhes do Projeto
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="como_ajudar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Como podemos ajudar? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva detalhadamente como podemos ajudar seu negócio..."
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="por_que_escolher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Por que escolher este projeto? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Explique por que devemos escolher trabalhar com você..."
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Botão de envio */}
              <div className="pt-6 text-center">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-12 py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Enviando Aplicação...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      Enviar Aplicação
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default Application;