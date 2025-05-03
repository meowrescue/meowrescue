
import { createClient } from '@supabase/supabase-js';

/**
 * Create and return the Supabase service client instance.
 * This client uses the service role key for server-side operations.
 */
export const getServiceClient = () => {
  try {
    // Get environment variables injected by Netlify
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
    
    // Check if credentials are available
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase service credentials missing. Please check Netlify environment variables.');
      throw new Error('Supabase service credentials missing');
    }

    return createClient(supabaseUrl, supabaseServiceKey);
  } catch (error) {
    console.error('Failed to create Supabase service client:', error);
    throw error;
  }
};

// Create a lazy-initialized service client instance
let serviceClientInstance = null;

export const serviceClient = () => {
  if (!serviceClientInstance) {
    serviceClientInstance = getServiceClient();
  }
  return serviceClientInstance;
};
