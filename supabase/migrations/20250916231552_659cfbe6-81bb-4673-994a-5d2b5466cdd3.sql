-- Drop the overly permissive SELECT policy that allows public access to sensitive data
DROP POLICY IF EXISTS "Allow RPC function access" ON public.balcao_opportunities;

-- Create a more secure policy that restricts SELECT access to only the RPC function
-- This prevents direct table access while allowing the get_public_opportunities function to work
CREATE POLICY "Secure RPC access only" ON public.balcao_opportunities
FOR SELECT USING (false);

-- Since we're using SECURITY DEFINER on the RPC function, it will bypass RLS
-- This ensures only the controlled, sanitized data from the RPC is accessible