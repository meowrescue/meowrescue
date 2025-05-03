// Fix Supabase client issues
(function() {
  window.addEventListener('DOMContentLoaded', function() {
    // Handle Supabase client URLs
    if (typeof window.supabase !== 'undefined') {
      console.log('Fixing Supabase client references');
      
      // Fix any direct URLs
      const fixSupabaseURLs = function() {
        const elements = document.querySelectorAll('[src*="getSupabaseClient()"], [href*="getSupabaseClient()"]');
        elements.forEach(function(el) {
          // Get the original URL
          let url = el.src || el.href;
          if (url && url.includes('getSupabaseClient()')) {
            // Fix the URL
            url = url.replace(/getSupabaseClient()/g, 'supabase');
            
            // Update the element
            if (el.src) el.src = url;
            if (el.href) el.href = url;
            
            console.log('Fixed Supabase URL reference');
          }
        });
      };
      
      // Try to run immediately
      fixSupabaseURLs();
      
      // Also run after a short delay to catch dynamically added elements
      setTimeout(fixSupabaseURLs, 1000);
    }
  });
})();
