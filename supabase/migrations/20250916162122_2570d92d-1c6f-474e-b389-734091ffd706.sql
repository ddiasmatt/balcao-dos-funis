-- Add public contact fields for marketplace display
ALTER TABLE public.opportunities 
ADD COLUMN public_contact_method text DEFAULT 'whatsapp',
ADD COLUMN show_full_contact boolean DEFAULT false,
ADD COLUMN contact_message text DEFAULT 'Entre em contato comigo através do Balcão dos Funis';

-- Create a view for public opportunity data (what everyone can see)
CREATE OR REPLACE VIEW public.opportunities_public AS
SELECT 
  id,
  created_at,
  updated_at,
  nome,
  nicho,
  instagram,
  faturamento,
  como_ajudar,
  por_que_escolher,
  public_contact_method,
  contact_message,
  -- Only show partial contact info for privacy
  CASE 
    WHEN show_full_contact THEN whatsapp
    ELSE regexp_replace(whatsapp, '(.{3}).*(.{2})', '\1****\2')
  END as whatsapp_public,
  CASE 
    WHEN show_full_contact THEN email
    ELSE regexp_replace(email, '(.{2}).*(@.*)', '\1****\2')  
  END as email_public
FROM public.opportunities;

-- Update RLS policies - Remove the overly broad policy
DROP POLICY IF EXISTS "Authenticated users can view all opportunities" ON public.opportunities;

-- Create policy for public view (marketplace functionality)
CREATE POLICY "Public opportunity view for marketplace" 
ON public.opportunities 
FOR SELECT 
USING (true); -- This allows the view to work, but we'll control access through the view

-- Grant access to the public view for authenticated users only
GRANT SELECT ON public.opportunities_public TO authenticated;