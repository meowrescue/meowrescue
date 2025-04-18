
import { createClient } from '@supabase/supabase-js';

// Use the actual values directly instead of environment variables
const supabaseUrl = 'https://sfrlnidbiviniuqhryyc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MDMxNTEsImV4cCI6MjA2MDA3OTE1MX0.vHK31AKqwD0a6GKGUQWMEFWo3zOb37LAEMXAmOATawI';

// Create the Supabase client with explicit configuration for reliability
export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: localStorage
    }
  }
);

// Add a health check function to verify connection
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('cats').select('id').limit(1);
    return { connected: !error, error: error?.message };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { connected: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
