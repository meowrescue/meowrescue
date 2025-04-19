
import { createClient } from '@supabase/supabase-js';

// Use the actual values directly instead of environment variables
const supabaseUrl = 'https://sfrlnidbiviniuqhryyc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MDMxNTEsImV4cCI6MjA2MDA3OTE1MX0.vHK31AKqwD0a6GKGUQWMEFWo3zOb37LAEMXAmOATawI';

// Ensure we use a singleton pattern for the Supabase client
let supabaseInstance = null;

/**
 * Create and return the Supabase client instance.
 * Uses a singleton pattern to prevent multiple instances.
 */
const getSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: typeof window !== 'undefined' ? localStorage : undefined
      }
    }
  );

  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();

// Add a health check function to verify connection
export const checkSupabaseConnection = async () => {
  try {
    console.log('Checking Supabase connection...');
    // Simple query to test connection
    const { data, error } = await supabase.from('cats').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return { connected: false, error: error.message, details: error };
    }
    
    console.log('Supabase connection successful');
    return { connected: true, data };
  } catch (err) {
    console.error('Exception checking Supabase connection:', err);
    return { 
      connected: false, 
      error: err instanceof Error ? err.message : 'Unknown error',
      details: err
    };
  }
};
