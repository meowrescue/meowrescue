/**
 * Centralized Supabase configuration and initialization
 * This ensures a single source of truth for Supabase configuration
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ensure a singleton instance of Supabase client
let supabaseInstance: SupabaseClient | null = null;

/**
 * Create and return the Supabase client instance.
 * Uses a singleton pattern to prevent multiple instances.
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    // Get environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Check if credentials are available
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing. Please check environment variables.');
      throw new Error('Supabase credentials missing');
    }

    // Create and store Supabase client
    supabaseInstance = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true
        },
        global: {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      }
    );
    
    return supabaseInstance;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    throw error;
  }
};

/**
 * Adds Supabase to window object for compatibility with legacy code
 * Not recommended for new code, but ensures backward compatibility
 */
export const ensureGlobalSupabase = (): void => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    if (!window.supabase) {
      console.log('Setting up global supabase instance for backward compatibility');
      // @ts-ignore
      window.supabase = getSupabaseClient();
    }
  }
};

/**
 * Check Supabase connection health
 */
export const checkSupabaseConnection = async () => {
  try {
    console.log('Checking Supabase connection...');
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('donations').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return { connected: false, error: error.message, details: error };
    }
    
    console.log('Supabase connection successful, test data:', data);
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

// Default export for module
export default {
  getSupabaseClient,
  ensureGlobalSupabase,
  checkSupabaseConnection
};
