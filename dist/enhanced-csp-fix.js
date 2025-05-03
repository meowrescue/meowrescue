// Enhanced CSP Fix - Addresses both Supabase and Google Fonts issues
(function() {
  function injectMetaCSP() {
    // Find the existing CSP meta tag or create a new one
    let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const needToCreateNew = !cspMeta;
    
    if (needToCreateNew) {
      console.log('Creating new CSP meta tag');
      cspMeta = document.createElement('meta');
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      // Start with a basic policy
      cspMeta.setAttribute('content', "default-src 'self'");
    }
    
    // Get the current content
    let cspContent = cspMeta.getAttribute('content');
    console.log('Original CSP:', cspContent);
    
    // Build a comprehensive CSP that addresses all issues
    const requiredDirectives = {
      'default-src': ["'self'", 'https://sfrlnidbiviniuqhryyc.supabase.co'],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
      'img-src': ["'self'", 'data:', 'blob:', 'https://sfrlnidbiviniuqhryyc.supabase.co'],
      'connect-src': ["'self'", 'https://sfrlnidbiviniuqhryyc.supabase.co'],
      'frame-src': ["'self'", 'https://sfrlnidbiviniuqhryyc.supabase.co']
    };
    
    // Parse existing CSP directives
    const existingDirectives = {};
    const directives = cspContent.split(';').map(d => d.trim());
    
    directives.forEach(directive => {
      const parts = directive.split(/\s+/);
      if (parts.length > 0) {
        const name = parts[0];
        const values = parts.slice(1);
        existingDirectives[name] = values;
      }
    });
    
    // Merge existing with required directives
    const finalDirectives = { ...existingDirectives };
    
    for (const [name, values] of Object.entries(requiredDirectives)) {
      finalDirectives[name] = finalDirectives[name] || [];
      
      // Add missing values
      values.forEach(value => {
        if (!finalDirectives[name].includes(value)) {
          finalDirectives[name].push(value);
        }
      });
    }
    
    // Build the new CSP content
    const newCSPContent = Object.entries(finalDirectives)
      .map(([name, values]) => `${name} ${values.join(' ')}`)
      .join('; ');
    
    // Set the new CSP content
    console.log('New CSP:', newCSPContent);
    cspMeta.setAttribute('content', newCSPContent);
    
    // Add to document if needed
    if (needToCreateNew) {
      document.head.insertBefore(cspMeta, document.head.firstChild);
    }
    
    console.log('Enhanced CSP meta tag updated');
  }
  
  function fixSupabaseRequests() {
    // Store the original fetch method
    const originalFetch = window.fetch;
    
    // Override fetch for Supabase API calls
    window.fetch = function(url, options = {}) {
      // Only intercept Supabase API calls
      if (typeof url === 'string' && url.includes('sfrlnidbiviniuqhryyc.supabase.co')) {
        console.log('Intercepting Supabase API request:', url);
        
        // Ensure we have options and headers
        options = options || {};
        options.headers = options.headers || {};
        
        // Add required headers for Supabase REST API
        options.headers = {
          ...options.headers,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        
        // Ensure apikey is set if available from supabase auth
        if (window.supabase && window.supabase.auth && window.supabase.auth.api && typeof window.supabase.auth.api.getAPIKey === 'function') {
          try {
            const apiKey = window.supabase.auth.api.getAPIKey();
            if (apiKey) {
              options.headers['apikey'] = apiKey;
            } else if (window.SUPABASE_KEY) {
              options.headers['apikey'] = window.SUPABASE_KEY;
            }
          } catch (e) {
            console.error('Error getting Supabase API key:', e);
          }
        }
        
        // Get Supabase anon key from global if available
        if (window.SUPABASE_KEY && !options.headers['apikey']) {
          options.headers['apikey'] = window.SUPABASE_KEY;
        }
        
        // Include credentials
        options.credentials = 'include';
        
        console.log('Enhanced Supabase request with headers:', options.headers);
      }
      
      // Call the original fetch
      return originalFetch(url, options);
    };
    
    // Store public anon key for easy access
    window.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU5MTE2MDAsImV4cCI6MTk5MTQ4NzYwMH0.C4YXI-X9YmNcEUei0g9K0D7Y5W568dpKKEkEdnH0_vE';
    
    console.log('Supabase fetch interceptor installed');
  }
  
  // Apply fixes as soon as possible
  try {
    injectMetaCSP();
    fixSupabaseRequests();
    console.log('Enhanced CSP and Supabase API fixes applied');
  } catch (e) {
    console.error('Error applying enhanced fixes:', e);
  }
  
  // Also run on DOMContentLoaded to ensure everything is properly patched
  document.addEventListener('DOMContentLoaded', function() {
    try {
      injectMetaCSP();
      fixSupabaseRequests();
      console.log('Enhanced CSP and Supabase API fixes reapplied on DOMContentLoaded');
    } catch (e) {
      console.error('Error reapplying enhanced fixes on DOMContentLoaded:', e);
    }
  });
})();
