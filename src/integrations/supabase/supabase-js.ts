// Re-export the official `@supabase/supabase-js` library
import * as supabaseJs from '@supabase/supabase-js';

// Export all named exports
export const createClient = supabaseJs.createClient;
export const SupabaseClient = supabaseJs.SupabaseClient;
export const Session = supabaseJs.Session;
export const User = supabaseJs.User;

// Export everything else
export * from '@supabase/supabase-js';

// Default export
export default supabaseJs;
