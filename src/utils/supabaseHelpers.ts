import getSupabaseClient from '@/integrations/supabase/client';

/**
 * Ensures that a Supabase client is properly initialized before using it
 * This function should be used in all components that interact with Supabase
 * to prevent "supabase is not defined" errors
 * 
 * @returns A properly initialized Supabase client
 */
export const ensureSupabaseClient = () => {
  return getSupabaseClient();
};

/**
 * Wraps a Supabase query function to ensure the client is properly initialized
 * 
 * @param queryFn The query function that uses Supabase
 * @returns A function that ensures Supabase is initialized before executing the query
 */
export const withSupabase = <T, Args extends any[]>(
  queryFn: (supabase: ReturnType<typeof getSupabaseClient>, ...args: Args) => Promise<T>
) => {
  return async (...args: Args): Promise<T> => {
    const supabase = getSupabaseClient();
    return queryFn(supabase, ...args);
  };
};
