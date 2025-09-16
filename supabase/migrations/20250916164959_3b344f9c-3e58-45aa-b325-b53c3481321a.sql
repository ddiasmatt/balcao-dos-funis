-- Update the get_public_opportunities function to always show full contact details
CREATE OR REPLACE FUNCTION public.get_public_opportunities()
 RETURNS TABLE(id uuid, created_at timestamp with time zone, updated_at timestamp with time zone, nome text, nicho text, instagram text, faturamento text, como_ajudar text, por_que_escolher text, public_contact_method text, contact_message text, whatsapp_public text, email_public text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT 
    o.id,
    o.created_at,
    o.updated_at,
    o.nome,
    o.nicho,
    o.instagram,
    o.faturamento,
    o.como_ajudar,
    o.por_que_escolher,
    o.public_contact_method,
    o.contact_message,
    -- Always show full contact info (no obfuscation)
    o.whatsapp as whatsapp_public,
    o.email as email_public
  FROM public.opportunities o;
$function$;