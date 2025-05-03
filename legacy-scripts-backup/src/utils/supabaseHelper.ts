import getSupabaseClient from '@/integrations/supabase/client';

/**
 * Helper function to ensure supabase is available globally
 * This is a temporary fix for components that expect supabase to be globally available
 */
export const ensureGlobalSupabase = () => {
  // Only run in browser environment
  if (typeof window !== 'undefined') {
    // @ts-ignore - Add supabase to window for legacy code that doesn't import it correctly
    if (!window.supabase) {
      console.log('Setting up global supabase instance for backward compatibility');
      // @ts-ignore
      window.supabase = getSupabaseClient();
    }
  }
};

/**
 * Safely get the supabase client, either from global or by creating a new instance
 * This helps prevent "supabase is not defined" errors
 */
export const getSafeSupabaseClient = () => {
  // Check for global instance first
  // @ts-ignore
  if (typeof window !== 'undefined' && window.supabase) {
    // @ts-ignore
    return window.supabase;
  }
  
  // Otherwise get a new instance
  return getSupabaseClient();
};

export default getSafeSupabaseClient;
