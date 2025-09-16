-- Check for any remaining dependencies on user_id column
-- Drop any policies that might reference user_id
DO $$
BEGIN
    -- Drop policies that might reference user_id if they exist
    DROP POLICY IF EXISTS "Users can view their own opportunities" ON public.balcao_opportunities;
    DROP POLICY IF EXISTS "Users can create their own opportunities" ON public.balcao_opportunities;
    DROP POLICY IF EXISTS "Users can update their own opportunities" ON public.balcao_opportunities;
    DROP POLICY IF EXISTS "Users can delete their own opportunities" ON public.balcao_opportunities;
    
    -- Now try to drop the user_id column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'balcao_opportunities' AND column_name = 'user_id') THEN
        ALTER TABLE public.balcao_opportunities DROP COLUMN user_id CASCADE;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- If there's still an error, log it but continue
        RAISE NOTICE 'Could not drop user_id or policies: %', SQLERRM;
END $$;

-- Ensure id is properly set as primary key (it should already be, but let's make sure)
DO $$
BEGIN
    -- Check if primary key constraint exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'balcao_opportunities' 
                   AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE public.balcao_opportunities ADD PRIMARY KEY (id);
    END IF;
END $$;