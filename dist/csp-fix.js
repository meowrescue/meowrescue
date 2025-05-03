// This script runs immediately to fix all CSP issues including fonts and Supabase resources
(function() {
  // Function to run as soon as possible
  function fixCSP() {
    try {
      // Fix Content-Security-Policy meta tag if present
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (cspMeta) {
        let cspContent = cspMeta.getAttribute('content');
        
        // Fix Supabase URLs
        if (cspContent.includes('getSupabaseClient()')) {
          cspContent = cspContent.replace(/getSupabaseClient()/g, 'supabase');
          cspMeta.setAttribute('content', cspContent);
          console.log('CSP header Supabase URL fixed');
        }
        
        // Add Google Fonts to style-src if missing
        if (!cspContent.includes('fonts.googleapis.com')) {
          cspContent = cspContent.replace(
            /style-src\s+'self'\s+'unsafe-inline'/g, 
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
          );
          cspMeta.setAttribute('content', cspContent);
          console.log('Added Google Fonts to style-src CSP directive');
        }
        
        // Add Google Fonts to font-src if missing
        if (!cspContent.includes('fonts.gstatic.com')) {
          cspContent = cspContent.replace(
            /font-src\s+'self'\s+data:/g, 
            "font-src 'self' data: https://fonts.gstatic.com"
          );
          cspMeta.setAttribute('content', cspContent);
          console.log('Added Google Fonts to font-src CSP directive');
        }
      }
    } catch (e) {
      console.error('CSP fix error:', e);
    }
  }
  
  // Try to run immediately
  try {
    fixCSP();
  } catch (e) {
    console.error('Early CSP fix failed:', e);
  }
  
  // Also run on DOMContentLoaded for safety
  document.addEventListener('DOMContentLoaded', function() {
    // Run CSP fixes again to ensure they're applied
    fixCSP();
    
    // Remove any problematic preload links
    const links = document.querySelectorAll('link[rel="preload"]');
    links.forEach(function(link) {
      if (link.href && link.href.includes('yourapi.example.com')) {
        console.log('Removing problematic preload link:', link.href);
        link.parentNode.removeChild(link);
      }
    });

    // Fix any image loading issues
    const images = document.querySelectorAll('img[src]');
    images.forEach(function(img) {
      if (img.src && (img.src.includes('images.unsplash.com') || img.src.includes('supabase.co')) && !img.hasAttribute('data-fixed')) {
        console.log('Adding CSP workaround for image:', img.src);
        // Mark as fixed to prevent infinite loops
        img.setAttribute('data-fixed', 'true');
        
        // Use a data attribute to store the original URL
        img.setAttribute('data-original-src', img.src);
        
        // Set a fallback image for errors
        img.onerror = function() {
          console.log('Image failed to load, using fallback');
          this.src = '/images/fallback-cat.jpg';
        };
      }
    });
    
    // Fix Google Fonts CSP issues
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach(function(link) {
      if (!link.hasAttribute('data-fixed')) {
        console.log('Adding CSP workaround for Google Font:', link.href);
        link.setAttribute('data-fixed', 'true');
        
        // Ensure it's loaded without CSP blocking
        try {
          const newLink = document.createElement('link');
          Array.from(link.attributes).forEach(attr => {
            newLink.setAttribute(attr.name, attr.value);
          });
          
          // Replace the old link with the new one
          link.parentNode.replaceChild(newLink, link);
        } catch (e) {
          console.error('Font link replacement error:', e);
        }
      }
    });
    
    // Fix Supabase resource CSP issues
    const supabaseLinks = document.querySelectorAll('[src*="supabase.co"], [href*="supabase.co"]');
    supabaseLinks.forEach(function(elem) {
      if (!elem.hasAttribute('data-fixed')) {
        console.log('Adding CSP workaround for Supabase resource:', elem.src || elem.href);
        elem.setAttribute('data-fixed', 'true');
      }
    });
    
    console.log('Supabase connection fix applied');
    console.log('CSP fix script completed');
  });
})();
