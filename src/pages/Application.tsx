import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Stepper } from '@/components/Stepper';
import { Flame, ArrowLeft, ArrowRight, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { nichos } from '@/lib/data';

const applicationSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  nicho: z.string().min(1, 'Selecione um nicho'),
  instagram: z.string().min(1, 'Instagram é obrigatório').regex(/^@/, 'Instagram deve começar com @'),
  whatsapp: z.string().min(1, 'WhatsApp é obrigatório'),
  email: z.string().email('Email inválido'),
  faturamento: z.string().min(1, 'Faturamento é obrigatório'),
  como_ajudar: z.string().min(10, 'Descreva como podemos ajudar (mínimo 10 caracteres)'),
  por_que_escolher: z.string().min(10, 'Explique por que escolher este projeto (mínimo 10 caracteres)'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const steps = ['Básico', 'Contato', 'Negócio', 'Projeto'];

const Application = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
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

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getFieldsForStep = (step: number): (keyof ApplicationFormData)[] => {
    switch (step) {
      case 0: return ['nome', 'nicho'];
      case 1: return ['instagram', 'whatsapp', 'email'];
      case 2: return ['faturamento'];
      case 3: return ['como_ajudar', 'por_que_escolher'];
      default: return [];
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('opportunities')
        .insert({
          user_id: user,
          ...data,
        });

      if (error) throw error;

      toast({
        title: "Aplicação enviada com sucesso!",
        description: "Em breve entraremos em contato.",
      });

      navigate('/dashboard');
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
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
                  <FormLabel>Nicho</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu nicho" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredNichos.map((nicho) => (
                        <SelectItem key={nicho} value={nicho}>
                          {nicho}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="@seuinstagram" {...field} />
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
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="+55 11 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="faturamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faturamento mensal atual</FormLabel>
                  <FormControl>
                    <Input placeholder="R$ 50.000,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="como_ajudar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Como podemos ajudar?</FormLabel>
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
                  <FormLabel>Por que escolher este projeto?</FormLabel>
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
        );

      default:
        return null;
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
              <h1 className="text-xl font-bold text-foreground">APLICAÇÃO</h1>
              <p className="text-sm text-primary font-semibold">BALCÃO DOS FUNIS</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Stepper */}
        <Stepper steps={steps} currentStep={currentStep} />

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-8 mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {currentStep === 0 && "Informações Básicas"}
              {currentStep === 1 && "Redes Sociais & Contato"}
              {currentStep === 2 && "Informações do Negócio"}
              {currentStep === 3 && "Detalhes do Projeto"}
            </h2>
            <p className="text-muted-foreground">
              Passo {currentStep + 1} de {steps.length}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Anterior
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep}>
                    Próximo
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Enviar Aplicação
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default Application;