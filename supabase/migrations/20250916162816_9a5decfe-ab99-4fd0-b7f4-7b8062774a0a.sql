-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_opportunities() TO authenticated;

-- Also grant to anon role for public access
GRANT EXECUTE ON FUNCTION public.get_public_opportunities() TO anon;