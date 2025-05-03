import getSupabaseClient from '@/integrations/supabase/client';

/**
 * Fixes common Supabase connection issues by ensuring proper headers
 * and configuration for API requests
 */
export function fixSupabaseConnection() {
  const supabase = getSupabaseClient();
  
  // Add proper Accept header to all Supabase requests
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
      
      console.log(`Fixing Supabase request headers for: ${input}`);
      return originalFetch(input, newInit);
    }
    
    // Pass through all other requests unchanged
    return originalFetch(input, init);
  };
  
  // Patch the Supabase client's internal fetch as well if possible
  try {
    if (supabase && supabase.rest && typeof supabase.rest.headers === 'object') {
      // Ensure proper Accept header is set in the Supabase client itself
      supabase.rest.headers['Accept'] = 'application/json';
    }
  } catch (error) {
    console.error('Error patching Supabase client headers:', error);
  }
  
  // Log successful initialization
  console.log('Supabase connection fix applied');
  
  return supabase;
}

/**
 * Fixes CSP issues with Supabase in the runtime environment
 */
export function fixSupabaseCSP() {
  try {
    // Get the Supabase URL from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    
    if (!supabaseUrl) {
      console.error('Supabase URL not found in environment variables');
      return;
    }
    
    // Extract the domain from the URL
    const supabaseDomain = new URL(supabaseUrl).hostname;
    
    // Find all meta tags with Content-Security-Policy
    const cspTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    
    cspTags.forEach(tag => {
      let content = tag.getAttribute('content') || '';
      
      // Fix img-src directive
      content = content.replace(
        /img-src\s+'self'\s+data:[^;]*(getSupabaseClient\(\)\.co|supabase\.co)[^;]*/g,
        `img-src 'self' data: blob: https://meowrescue.windsurf.build https://${supabaseDomain} https://images.unsplash.com`
      );
      
      // Fix connect-src directive
      content = content.replace(
        /connect-src\s+'self'[^;]*(getSupabaseClient\(\)\.co|supabase\.co)[^;]*/g,
        `connect-src 'self' https://${supabaseDomain} wss://${supabaseDomain} https:`
      );
      
      // Update the tag
      tag.setAttribute('content', content);
    });
    
    console.log('CSP headers fixed for Supabase');
  } catch (error) {
    console.error('Error fixing CSP headers:', error);
  }
}

/**
 * Initialize all Supabase fixes
 */
export function initSupabaseFixes() {
  // Fix CSP issues
  fixSupabaseCSP();
  
  // Fix connection issues
  return fixSupabaseConnection();
}

export default initSupabaseFixes;
