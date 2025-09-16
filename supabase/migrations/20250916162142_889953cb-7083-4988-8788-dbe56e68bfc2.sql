-- Remove the problematic view
DROP VIEW IF EXISTS public.opportunities_public;

-- Instead, create a function that returns public data safely
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
SECURITY INVOKER -- Use invoker's permissions, not definer's
STABLE
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

-- Update the RLS policy to be more restrictive for direct table access
DROP POLICY IF EXISTS "Public opportunity view for marketplace" ON public.opportunities;

-- Keep only the user-specific policies for direct table access
-- The function above will handle marketplace access safely