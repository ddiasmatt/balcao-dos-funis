import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api, ApiError } from "@/lib/api";

const schema = z.object({
  nome: z.string().trim().min(2, "Mínimo 2 caracteres").max(200),
  email: z.string().email("Email inválido"),
  nicho_slug: z.string().min(2, "Escolha um nicho"),
  instagram: z.string().trim().min(2, "Instagram obrigatório").max(100),
  whatsapp: z.string().trim().min(8, "WhatsApp obrigatório").max(40),
  faturamento: z.string().trim().min(1, "Faturamento obrigatório").max(100),
  como_ajudar: z.string().trim().min(10, "Conte em pelo menos 10 caracteres").max(2000),
  por_que_escolher: z.string().trim().min(10, "Conte em pelo menos 10 caracteres").max(2000),
  contact_message: z.string().trim().max(500).optional(),
  website: z.string().optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

export function PublishForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { website: "" },
  });

  const { data: niches, isLoading: niching } = useQuery({
    queryKey: ["niches"],
    queryFn: () => api.niches(),
    staleTime: 10 * 60_000,
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await api.submitOpportunity(values);
      onSuccess();
    } catch (err) {
      const msg = err instanceof ApiError ? err.detail : "Erro ao enviar. Tente novamente.";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Honeypot — invisível para humanos, bots preenchem */}
      <div aria-hidden style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="website">Seu site</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Seu nome" error={errors.nome?.message}>
          <Input placeholder="Nome e sobrenome" {...register("nome")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="voce@empresa.com" {...register("email")} />
        </Field>
        <Field label="WhatsApp" error={errors.whatsapp?.message}>
          <Input placeholder="(11) 91234-5678" {...register("whatsapp")} />
        </Field>
        <Field label="Instagram" error={errors.instagram?.message}>
          <Input placeholder="@seuperfil" {...register("instagram")} />
        </Field>
      </div>

      <Field label="Nicho do projeto" error={errors.nicho_slug?.message}>
        <Controller
          name="nicho_slug"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
              disabled={niching}
            >
              <SelectTrigger>
                <SelectValue placeholder={niching ? "Carregando nichos..." : "Escolha um nicho"} />
              </SelectTrigger>
              <SelectContent>
                {niches?.map((n) => (
                  <SelectItem key={n.slug} value={n.slug}>
                    {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field label="Faturamento mensal aproximado" error={errors.faturamento?.message} hint="Ex: R$ 50.000/mês ou 'pré-receita'">
        <Input placeholder="R$ 50.000/mês" {...register("faturamento")} />
      </Field>

      <Field label="Como podemos te ajudar?" error={errors.como_ajudar?.message}>
        <Textarea
          rows={4}
          placeholder="Descreva o que você precisa (ex: quero escalar meu perpétuo de R$ 100k pra R$ 300k/mês)."
          {...register("como_ajudar")}
        />
      </Field>

      <Field label="Por que um aluno deveria escolher você?" error={errors.por_que_escolher?.message}>
        <Textarea
          rows={4}
          placeholder="O que você oferece: cultura, estrutura, budget, crescimento, tipo de projeto..."
          {...register("por_que_escolher")}
        />
      </Field>

      <Field label="Recado adicional" error={errors.contact_message?.message} hint="Opcional. Aparece junto do contato.">
        <Textarea
          rows={2}
          placeholder="Ex: prefiro que você me mande direto no WhatsApp"
          {...register("contact_message")}
        />
      </Field>

      <div className="pt-3">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full gap-2"
          style={{ background: "var(--sigma)", color: "white" }}
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? "Enviando..." : "Publicar oportunidade"}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-fg">
          Ao publicar você concorda que os alunos entrem em contato com você por email ou WhatsApp.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-medium">{label}</Label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-fg">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
