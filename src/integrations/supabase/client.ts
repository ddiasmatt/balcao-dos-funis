import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase configuration - same for dev and production
const SUPABASE_URL = 'https://rhnmlyabpimvpshabbxx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJobm1seWFicGltdnBzaGFiYnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzEyNTgsImV4cCI6MjA3MzYwNzI1OH0.0qlxRF5r2e7Erbr-_qPyCK8vkP3xUVD4SVPrLHYTElU';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});