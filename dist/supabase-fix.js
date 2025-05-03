
// Fix Supabase connection issues
(function() {
  window.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up global supabase instance for backward compatibility');
    
    // Replace any broken Supabase URLs
    if (typeof window.getSupabaseClient === 'function') {
      const originalGetSupabaseClient = window.getSupabaseClient;
      window.getSupabaseClient = function() {
        const client = originalGetSupabaseClient();
        if (client && client.url && client.url.includes('getSupabaseClient()')) {
          client.url = client.url.replace('getSupabaseClient()', 'supabase');
          console.log('Supabase connection fix applied');
        }
        return client;
      };
    }
    
    // Fix CSP headers if needed
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (meta) {
      let content = meta.getAttribute('content');
      if (content.includes('getSupabaseClient()')) {
        content = content.replace(/getSupabaseClient()/g, 'supabase');
        meta.setAttribute('content', content);
        console.log('CSP headers fixed for Supabase');
      }
    }
  });
})();
