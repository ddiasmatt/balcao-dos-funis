import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Zap, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WebhookIntegration from '@/components/WebhookIntegration';

const Webhooks = () => {
  const navigate = useNavigate();

  const handleWebhookSuccess = (payload: any) => {
    console.log("Webhook triggered successfully:", payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-primary p-3 rounded-lg shadow-lg">
              <Zap size={28} className="text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground">Integrações</h1>
              <p className="text-sm text-primary font-semibold">n8n Webhooks</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Integrações com n8n
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Configure webhooks para automatizar processos e conectar o Balcão dos Funis 
              com seus workflows n8n.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Webhook Geral */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Geral</CardTitle>
                  <CardDescription>
                    Configure um webhook genérico para testar integrações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WebhookIntegration
                    title="Webhook Teste"
                    description="Dispare um webhook de teste"
                    defaultWebhookUrl="https://n8n.ltvtribe.com.br/webhook-test/2f44511d-53c9-4a6c-a9a8-12a088de3c80"
                    onSuccess={handleWebhookSuccess}
                    payload={{
                      type: "test",
                      message: "Webhook de teste disparado",
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Webhook de Aplicações */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook de Aplicações</CardTitle>
                  <CardDescription>
                    Automatize notificações quando novas aplicações forem recebidas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WebhookIntegration
                    title="Novas Aplicações"
                    description="Notificar sobre novas aplicações"
                    defaultWebhookUrl="https://n8n.ltvtribe.com.br/webhook/2f44511d-53c9-4a6c-a9a8-12a088de3c80"
                    onSuccess={handleWebhookSuccess}
                    payload={{
                      type: "new_application",
                      message: "Nova aplicação recebida no Balcão dos Funis",
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Documentação */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Como Configurar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">1. Crie um Workflow no n8n</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Acesse seu n8n e crie um novo workflow com um nó "Webhook".
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href="https://n8n.ltvtribe.com.br" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Abrir n8n
                      <ExternalLink size={14} />
                    </a>
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">2. Configure o Webhook</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Configure o método como POST e copie a URL do webhook gerada.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Método: POST</li>
                    <li>• Formato: JSON</li>
                    <li>• Headers automáticos</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-accent rounded-lg">
                <h5 className="font-medium mb-2">Payload Enviado:</h5>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "triggered_from": "https://app.ltvtribe.com.br",
  "source": "balcao_dos_funis",
  "type": "test|new_application",
  "message": "Descrição da ação"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Webhooks;