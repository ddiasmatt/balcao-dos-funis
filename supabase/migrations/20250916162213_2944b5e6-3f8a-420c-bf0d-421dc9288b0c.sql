-- Fix the search_path warning by setting it explicitly
CREATE OR REPLACE FUNCTION public.get_public_opportunities()
RETURNS TABLE (
  id uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  nome text,
  nicho text,
  instagram text,
  faturamento text,
  como_ajudar text,
  por_que_escolher text,
  public_contact_method text,
  contact_message text,
  whatsapp_public text,
  email_public text
)
LANGUAGE SQL
SECURITY INVOKER
STABLE
SET search_path = public -- This fixes the security warning
AS $$
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
    -- Only show partial contact info for privacy
    CASE 
      WHEN o.show_full_contact THEN o.whatsapp
      ELSE regexp_replace(o.whatsapp, '(.{3}).*(.{2})', '\1****\2')
    END as whatsapp_public,
    CASE 
      WHEN o.show_full_contact THEN o.email
      ELSE regexp_replace(o.email, '(.{2}).*(@.*)', '\1****\2')  
    END as email_public
  FROM public.opportunities o
  WHERE auth.role() = 'authenticated';
$$;