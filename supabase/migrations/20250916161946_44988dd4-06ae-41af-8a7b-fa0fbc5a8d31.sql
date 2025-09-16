-- Enable Row Level Security on opportunities table
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own opportunities
CREATE POLICY "Users can view their own opportunities" 
ON public.opportunities 
FOR SELECT 
USING (auth.uid()::text = user_id);

-- Create policy for users to insert their own opportunities  
CREATE POLICY "Users can create their own opportunities" 
ON public.opportunities 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Create policy for users to update their own opportunities
CREATE POLICY "Users can update their own opportunities" 
ON public.opportunities 
FOR UPDATE 
USING (auth.uid()::text = user_id) 
WITH CHECK (auth.uid()::text = user_id);

-- Create policy for users to delete their own opportunities
CREATE POLICY "Users can delete their own opportunities" 
ON public.opportunities 
FOR DELETE 
USING (auth.uid()::text = user_id);

-- Allow authenticated users to view all opportunities (for the marketplace functionality)
CREATE POLICY "Authenticated users can view all opportunities" 
ON public.opportunities 
FOR SELECT 
USING (auth.role() = 'authenticated');