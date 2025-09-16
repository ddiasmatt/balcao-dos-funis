-- Create a temporary policy that allows the RPC function to access data
CREATE POLICY "Allow RPC function access" 
ON public.opportunities 
FOR SELECT 
USING (true);

-- Test if this fixes the issue first, then we'll make it more secure