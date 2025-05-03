import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

/**
 * Initializes and returns the Supabase client instance (singleton).
 * Ensures only one instance is created.
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase URL or Anon Key is missing. Cannot initialize client. Check environment variables.');
      throw new Error('Supabase configuration is missing.');
    }
    console.log('Initializing Supabase client (singleton)...');
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

export const checkSupabaseConnection = async () => {
  try {
    const client = getSupabaseClient();
    const { error } = await client.auth.getSession();
    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

export const checkFinancialData = async () => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('financial_data')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    return data.length > 0;
  } catch (error) {
    console.error('Financial data check failed:', error);
    return false;
  }
};
