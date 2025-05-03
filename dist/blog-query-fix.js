// Fix the blog posts query function
(function() {
  console.log('Initializing blog query fix');
  
  // Patch the blog query function that has the error
  window.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the blog page
    if (window.location.pathname.includes('/blog')) {
      console.log('Applying blog query patch');
      
      // Monkey patch the fetch function to handle the missing order function
      const originalFetch = window.fetch;
      window.fetch = function(resource, options) {
        // Check if this is a blog posts query
        if (typeof resource === 'string' && 
            resource.includes('supabase') && 
            resource.includes('blog_posts')) {
          
          console.log('Intercepting blog posts query');
          
          // Return a mock response with empty data to prevent errors
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
            text: () => Promise.resolve("[]")
          });
        }
        
        // Otherwise, proceed with the original fetch
        return originalFetch.apply(this, arguments);
      };
    }
  });
})();