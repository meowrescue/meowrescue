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
    
    // Define the correct CSP directives
    const correctImgSrc = `img-src 'self' data: blob: https://meowrescue.windsurf.build https://${supabaseDomain} https://images.unsplash.com`;
    const correctConnectSrc = `connect-src 'self' https://${supabaseDomain} wss://${supabaseDomain} https:`;
    const correctScriptSrc = `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://${supabaseDomain}`;
    
    // Fix any meta tags with CSP
    const cspTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    
    cspTags.forEach(tag => {
      let content = tag.getAttribute('content') || '';
      
      // Replace img-src directive
      content = content.replace(/img-src[^;]*;/g, `${correctImgSrc};`);
      
      // Replace connect-src directive
      content = content.replace(/connect-src[^;]*;/g, `${correctConnectSrc};`);
      
      // Replace script-src directive
      content = content.replace(/script-src[^;]*;/g, `${correctScriptSrc};`);
      
      // Fix any remaining instances of getSupabaseClient().co
      content = content.replace(/https:\/\/[^\/]*getSupabaseClient\(\)\.co/g, `https://${supabaseDomain}`);
      content = content.replace(/wss:\/\/[^\/]*getSupabaseClient\(\)\.co/g, `wss://${supabaseDomain}`);
      
      // Update the tag
      tag.setAttribute('content', content);
    });
    
    // Also inject a CSP fix script that will run after any dynamic CSP changes
    const cspFixScript = document.createElement('script');
    cspFixScript.id = 'csp-fix-script';
    cspFixScript.type = 'text/javascript';
    cspFixScript.textContent = `
      (function() {
        // Fix CSP issues that might be injected dynamically
        function fixDynamicCSP() {
          // Get the Supabase domain
          const supabaseDomain = "${supabaseDomain}";
          
          // Define correct CSP directives
          const correctImgSrc = "img-src 'self' data: blob: https://meowrescue.windsurf.build https://" + supabaseDomain + " https://images.unsplash.com";
          const correctConnectSrc = "connect-src 'self' https://" + supabaseDomain + " wss://" + supabaseDomain + " https:";
          
          // Find any dynamically added CSP meta tags
          const cspTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
          
          cspTags.forEach(tag => {
            let content = tag.getAttribute('content') || '';
            
            // Fix img-src
            if (content.includes('img-src')) {
              content = content.replace(/img-src[^;]*;/g, correctImgSrc + ";");
            }
            
            // Fix connect-src
            if (content.includes('connect-src')) {
              content = content.replace(/connect-src[^;]*;/g, correctConnectSrc + ";");
            }
            
            // Fix any remaining instances of getSupabaseClient().co
            content = content.replace(/https:\/\/[^\/]*getSupabaseClient\(\)\.co/g, "https://" + supabaseDomain);
            content = content.replace(/wss:\/\/[^\/]*getSupabaseClient\(\)\.co/g, "wss://" + supabaseDomain);
            
            // Update the tag
            tag.setAttribute('content', content);
          });
        }
        
        // Run immediately
        fixDynamicCSP();
        
        // Also run on DOM changes to catch dynamically added CSP tags
        const observer = new MutationObserver(function(mutations) {
          fixDynamicCSP();
        });
        
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
        
        console.log("CSP fix script completed");
      })();
    `;
    
    // Add the script to the document
    if (!document.getElementById('csp-fix-script')) {
      document.head.appendChild(cspFixScript);
    }
    
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
