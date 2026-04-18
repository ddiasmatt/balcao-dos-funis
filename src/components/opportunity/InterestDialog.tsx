import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api, ApiError } from "@/lib/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunityId: string;
  contractorName: string;
}

export function InterestDialog({ open, onOpenChange, opportunityId, contractorName }: Props) {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.registerInterest(opportunityId, message.trim() || undefined),
    onSuccess: () => {
      toast.success("Interesse enviado! Verifique seu email.");
      queryClient.invalidateQueries({ queryKey: ["opportunity", opportunityId] });
      setMessage("");
      onOpenChange(false);
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 409) {
        toast.info("Você já manifestou interesse nessa oportunidade.");
        onOpenChange(false);
      } else {
        const msg = err instanceof ApiError ? err.detail : "Não foi possível enviar. Tente de novo.";
        toast.error(msg);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Enviar interesse</DialogTitle>
          <DialogDescription>
            Vamos avisar <strong>{contractorName}</strong> que você tem interesse. Ele recebe seu nome, email
            e WhatsApp para entrar em contato direto.
          </DialogDescription>
        </DialogHeader>

        <div>
          <label htmlFor="interest-message" className="mb-1.5 block text-sm font-medium">
            Mensagem <span className="text-muted-fg">(opcional)</span>
          </label>
          <Textarea
            id="interest-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Conta rápido por que você é uma boa opção pra esse projeto."
            rows={5}
            maxLength={1000}
          />
          <p className="mt-1 text-right text-xs text-muted-fg">{message.length}/1000</p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            style={{ background: "var(--sigma)", color: "white" }}
            className="gap-2"
          >
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Enviar interesse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
