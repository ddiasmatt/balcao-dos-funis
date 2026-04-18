import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Copy, Instagram, Loader2, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api, ApiError, type OpportunityContact } from "@/lib/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunityId: string;
  contractorName: string;
}

function normalizeWhatsapp(raw: string): string {
  return raw.replace(/\D/g, "");
}

function buildWhatsappUrl(raw: string): string {
  const digits = normalizeWhatsapp(raw);
  return digits ? `https://wa.me/${digits}` : "#";
}

function buildInstagramUrl(raw: string): string {
  const handle = raw.trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
  return handle ? `https://instagram.com/${handle}` : "#";
}

function copyToClipboard(value: string, label: string) {
  try {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copiado`);
  } catch {
    toast.error("Não consegui copiar — copie manualmente");
  }
}

export function InterestDialog({ open, onOpenChange, opportunityId, contractorName }: Props) {
  const [contact, setContact] = useState<OpportunityContact | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => api.revealOpportunityContact(opportunityId),
    onSuccess: (res) => {
      setContact(res.contact);
      setAlreadyRegistered(res.already_registered);
      setErrorMsg(null);
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? err.status === 410
            ? "Esta oportunidade já foi fechada pelo contratante."
            : err.detail
          : "Não foi possível carregar agora. Tente de novo.";
      setErrorMsg(msg);
    },
  });

  useEffect(() => {
    if (!open) {
      setContact(null);
      setAlreadyRegistered(false);
      setErrorMsg(null);
      return;
    }
    mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, opportunityId]);

  const loading = mutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Contato de {contractorName}</DialogTitle>
          <DialogDescription>
            {alreadyRegistered
              ? "Você já tinha visualizado essa oportunidade. Aqui estão os dados de contato de novo."
              : "Avisamos o contratante que você se interessou. Entre em contato pelos canais abaixo."}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-10 text-secondary-fg">
            <Loader2 size={18} className="mr-2 animate-spin" /> Carregando contatos...
          </div>
        )}

        {!loading && errorMsg && (
          <div
            className="flex items-start gap-2 rounded-lg border p-4 text-sm"
            style={{ borderColor: "rgba(255,90,90,0.3)", background: "rgba(255,90,90,0.08)", color: "#fca5a5" }}
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!loading && !errorMsg && contact && (
          <div className="space-y-3">
            {contact.email && (
              <ContactRow
                icon={<Mail size={16} />}
                label="Email"
                value={contact.email}
                href={`mailto:${contact.email}`}
                onCopy={() => copyToClipboard(contact.email!, "Email")}
              />
            )}

            {contact.whatsapp && (
              <ContactRow
                icon={<MessageCircle size={16} />}
                label="WhatsApp"
                value={contact.whatsapp}
                href={buildWhatsappUrl(contact.whatsapp)}
                hrefNewTab
                onCopy={() => copyToClipboard(contact.whatsapp!, "WhatsApp")}
              />
            )}

            {contact.instagram && (
              <ContactRow
                icon={<Instagram size={16} />}
                label="Instagram"
                value={`@${contact.instagram.replace(/^@/, "")}`}
                href={buildInstagramUrl(contact.instagram)}
                hrefNewTab
                onCopy={() => copyToClipboard(`@${contact.instagram!.replace(/^@/, "")}`, "Instagram")}
              />
            )}

            {contact.contact_message && (
              <div
                className="rounded-lg p-4 text-sm"
                style={{ border: "1px solid rgba(124,111,255,0.25)", background: "rgba(124,111,255,0.08)" }}
              >
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-fg">Recado do contratante</div>
                <p className="leading-relaxed text-primary-fg">{contact.contact_message}</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface RowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  hrefNewTab?: boolean;
  onCopy: () => void;
}

function ContactRow({ icon, label, value, href, hrefNewTab, onCopy }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-primary-fg">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-fg">{label}</div>
          <a
            href={href}
            target={hrefNewTab ? "_blank" : undefined}
            rel={hrefNewTab ? "noopener noreferrer" : undefined}
            className="block truncate text-sm font-medium text-primary-fg hover:underline"
          >
            {value}
          </a>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="gap-1.5" onClick={onCopy} aria-label={`Copiar ${label}`}>
        <Copy size={13} /> Copiar
      </Button>
    </div>
  );
}
