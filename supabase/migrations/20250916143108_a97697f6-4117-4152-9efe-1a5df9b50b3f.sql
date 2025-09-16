-- Fix opportunities table to work with email-based auth instead of UUID
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own applications" ON public.opportunities;
DROP POLICY IF EXISTS "Users can create their own applications" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete their own applications" ON public.opportunities;

-- Change user_id column from UUID to TEXT to store email
ALTER TABLE public.opportunities ALTER COLUMN user_id TYPE TEXT;

-- Create new policies that work with email-based authentication
CREATE POLICY "Users can view their own applications" 
ON public.opportunities 
FOR SELECT 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'email' OR user_id = current_setting('request.headers', true)::json->>'x-user-email');

CREATE POLICY "Users can create their own applications" 
ON public.opportunities 
FOR INSERT 
WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'email' OR user_id = current_setting('request.headers', true)::json->>'x-user-email');

CREATE POLICY "Users can update their own applications" 
ON public.opportunities 
FOR UPDATE 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'email' OR user_id = current_setting('request.headers', true)::json->>'x-user-email');

CREATE POLICY "Users can delete their own applications" 
ON public.opportunities 
FOR DELETE 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'email' OR user_id = current_setting('request.headers', true)::json->>'x-user-email');