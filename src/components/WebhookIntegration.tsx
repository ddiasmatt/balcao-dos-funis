import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Webhook, Send, Loader2 } from 'lucide-react';

interface WebhookIntegrationProps {
  title?: string;
  description?: string;
  defaultWebhookUrl?: string;
  onSuccess?: (data: any) => void;
  payload?: Record<string, any>;
}

const WebhookIntegration: React.FC<WebhookIntegrationProps> = ({
  title = "n8n Webhook Integration",
  description = "Connect your n8n workflows to automate processes",
  defaultWebhookUrl = "",
  onSuccess,
  payload = {}
}) => {
  const [webhookUrl, setWebhookUrl] = useState(defaultWebhookUrl);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast({
        title: "Erro",
        description: "Por favor, insira a URL do webhook n8n",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    if (!webhookUrl.includes('n8n.ltvtribe.com.br/webhook')) {
      toast({
        title: "URL Inválida",
        description: "Por favor, insira uma URL válida do n8n (deve conter 'n8n.ltvtribe.com.br/webhook')",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Triggering n8n webhook:", webhookUrl);

    try {
      const webhookPayload = {
        timestamp: new Date().toISOString(),
        triggered_from: window.location.origin,
        source: "balcao_dos_funis",
        ...payload
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Handle CORS for external webhooks
        body: JSON.stringify(webhookPayload),
      });

      // Since we're using no-cors, we won't get a proper response status
      toast({
        title: "Webhook Enviado",
        description: "A requisição foi enviada para o n8n. Verifique o histórico do seu workflow para confirmar o trigger.",
      });

      if (onSuccess) {
        onSuccess(webhookPayload);
      }

    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Erro",
        description: "Falha ao disparar o webhook n8n. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook size={20} className="text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTrigger} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook n8n</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://n8n.ltvtribe.com.br/webhook/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Cole aqui a URL do webhook do seu workflow n8n
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !webhookUrl}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Disparar Webhook
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-4 p-3 bg-accent rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Dica:</strong> URLs de exemplo:
            <br />
            • https://n8n.ltvtribe.com.br/webhook/[id]
            <br />
            • https://n8n.ltvtribe.com.br/webhook-test/[id]
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookIntegration;