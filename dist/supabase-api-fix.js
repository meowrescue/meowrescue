// Enhanced Supabase API Fix - Addresses 406 errors and CSP issues
(function() {
  // Execute immediately and also on DOMContentLoaded
  function applySupabaseFixes() {
    console.log('Applying enhanced Supabase API fixes');
    
    // Fix Content Security Policy for Supabase
    fixCSPForSupabase();
    
    // Fix Supabase client API calls
    patchSupabaseClient();
  }
  
  // Add necessary CSP directives to allow Supabase connections
  function fixCSPForSupabase() {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspMeta) {
      let cspContent = cspMeta.getAttribute('content');
      
      // Only modify if we haven't already updated it
      if (!cspContent.includes('sfrlnidbiviniuqhryyc.supabase.co')) {
        // Add frame-src directive for Supabase iframes
        if (!cspContent.includes('frame-src')) {
          cspContent += "; frame-src 'self' https://sfrlnidbiviniuqhryyc.supabase.co";
        } else if (!cspContent.includes('frame-src') || !cspContent.includes('sfrlnidbiviniuqhryyc.supabase.co')) {
          cspContent = cspContent.replace(/frame-src\s+([^;]+)/, 'frame-src $1 https://sfrlnidbiviniuqhryyc.supabase.co');
        }
        
        // Add connect-src directive for Supabase API
        if (!cspContent.includes('connect-src')) {
          cspContent += "; connect-src 'self' https://sfrlnidbiviniuqhryyc.supabase.co";
        } else if (!cspContent.includes('connect-src') || !cspContent.includes('sfrlnidbiviniuqhryyc.supabase.co')) {
          cspContent = cspContent.replace(/connect-src\s+([^;]+)/, 'connect-src $1 https://sfrlnidbiviniuqhryyc.supabase.co');
        }
        
        // Add default-src exception if needed
        if (cspContent.includes("default-src 'self'") && !cspContent.includes('sfrlnidbiviniuqhryyc.supabase.co')) {
          cspContent = cspContent.replace(/default-src\s+'self'/, "default-src 'self' https://sfrlnidbiviniuqhryyc.supabase.co");
        }
        
        // Update the meta tag
        cspMeta.setAttribute('content', cspContent);
        console.log('Updated CSP directives for Supabase connections');
      }
    } else {
      // If no CSP meta tag exists, create one with permissive settings for Supabase
      const newMeta = document.createElement('meta');
      newMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      newMeta.setAttribute('content', "default-src 'self'; connect-src 'self' https://sfrlnidbiviniuqhryyc.supabase.co; frame-src 'self' https://sfrlnidbiviniuqhryyc.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'");
      document.head.appendChild(newMeta);
      console.log('Created CSP meta tag with Supabase permissions');
    }
  }
  
  // Patch the Supabase client to fix 406 Not Acceptable errors
  function patchSupabaseClient() {
    // Check if supabase client exists in window
    if (typeof window.supabase !== 'undefined') {
      console.log('Patching Supabase client for API compatibility');
      
      // Store the original fetch method
      const originalFetch = window.fetch;
      
      // Override fetch to add required headers for Supabase
      window.fetch = function(url, options = {}) {
        // Check if this is a Supabase API call
        if (typeof url === 'string' && url.includes('sfrlnidbiviniuqhryyc.supabase.co')) {
          // Ensure options and headers exist
          options = options || {};
          options.headers = options.headers || {};
          
          // Add the required headers for Supabase REST API
          options.headers = {
            ...options.headers,
            'apikey': window.supabase.auth.api.getAPIKey(),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Client-Info': 'meowrescue/1.0.0'
          };
          
          // Ensure credentials are included
          options.credentials = 'include';
          
          console.log('Enhanced Supabase API request headers');
        }
        
        // Call the original fetch with our enhanced options
        return originalFetch(url, options);
      };
      
      // Patch supabase client directly if available
      if (window.supabase && window.supabase.rest) {
        const originalRequest = window.supabase.rest.request;
        window.supabase.rest.request = function(method, path, options = {}) {
          // Ensure options and headers exist
          options = options || {};
          options.headers = options.headers || {};
          
          // Add the required headers for Supabase REST API
          options.headers = {
            ...options.headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Client-Info': 'meowrescue/1.0.0'
          };
          
          console.log('Enhanced Supabase REST request headers');
          return originalRequest(method, path, options);
        };
      }
    }
  }
  
  // Try to run immediately
  try {
    applySupabaseFixes();
  } catch (e) {
    console.error('Early Supabase fix failed:', e);
  }
  
  // Also run when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    try {
      applySupabaseFixes();
      console.log('Supabase API fixes applied successfully');
    } catch (e) {
      console.error('Supabase fix on DOMContentLoaded failed:', e);
    }
  });
})();
