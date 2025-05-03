/**
 * Centralized Supabase client that replaces all previous fix scripts
 * This provides a clean way to interact with Supabase without runtime patches
 */

import { getSupabaseClient } from '@/config/supabase';

/**
 * Get a properly configured Supabase client instance
 * This replaces all previous patching approaches with a clean implementation
 */
export function getClient() {
  const supabase = getSupabaseClient();
  
  // Ensure proper headers are set
  if (typeof window !== 'undefined' && supabase && supabase.rest && supabase.rest.headers) {
    // Set proper headers for the Supabase client
    try {
      // @ts-ignore - Add proper Accept header
      supabase.rest.headers['Accept'] = 'application/json';
      
      // @ts-ignore - Add proper Content-Type if not present
      if (!supabase.rest.headers['Content-Type'] && !supabase.rest.headers['content-type']) {
        supabase.rest.headers['Content-Type'] = 'application/json';
      }
    } catch (err) {
      console.warn('Could not set Supabase headers directly:', err);
    }
  }
  
  return supabase;
}

/**
 * Check connection to Supabase and return status
 */
export async function checkConnection() {
  try {
    console.log('Checking Supabase connection...');
    const supabase = getClient();
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
}

/**
 * Migration helper to ensure backward compatibility
 * This helps existing code transition to the new Supabase client pattern
 */
export function ensureBackwardCompatibility() {
  if (typeof window !== 'undefined') {
    // Ensure proper fetch headers for Supabase requests
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      // Only modify Supabase requests
      if (typeof input === 'string' && input.includes('supabase.co')) {
        // Create new init object if it doesn't exist
        const newInit = init || {};
        
        // Create headers object if it doesn't exist
        newInit.headers = newInit.headers || {};
        
        // Convert headers to plain object if it's a Headers instance
        if (newInit.headers instanceof Headers) {
          const plainHeaders = {};
          newInit.headers.forEach((value, key) => {
            plainHeaders[key] = value;
          });
          newInit.headers = plainHeaders;
        }
        
        // Add proper Accept header for JSON responses
        newInit.headers['Accept'] = 'application/json';
        
        // Add proper Content-Type header if not present
        if (!newInit.headers['Content-Type'] && !newInit.headers['content-type']) {
          newInit.headers['Content-Type'] = 'application/json';
        }
        
        return originalFetch(input, newInit);
      }
      
      // Pass through all other requests unchanged
      return originalFetch(input, init);
    };

    // @ts-ignore - Add supabase to window for legacy code
    if (!window.supabase) {
      console.log('Setting up global supabase instance for backward compatibility');
      // @ts-ignore
      window.supabase = getClient();
    }
  }
}

// Export default for importing as default
export default getClient;
