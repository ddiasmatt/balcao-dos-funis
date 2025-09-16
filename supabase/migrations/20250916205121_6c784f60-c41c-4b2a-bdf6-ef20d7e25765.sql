-- Remover política restritiva de INSERT
DROP POLICY "Users can create their own opportunities" ON public.balcao_opportunities;

-- Criar nova política que permite inserções públicas para aplicações
CREATE POLICY "Allow public applications" 
ON public.balcao_opportunities 
FOR INSERT 
TO public
WITH CHECK (true);

-- Manter as outras políticas para usuários autenticados visualizarem suas próprias oportunidades