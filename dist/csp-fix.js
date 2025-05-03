// This script runs immediately to fix any CSP issues by removing problematic preload links
(function() {
  // Remove any preload links to external APIs
  document.addEventListener('DOMContentLoaded', function() {
    // Remove any links to yourapi.example.com
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
      if (img.src && img.src.includes('images.unsplash.com') && !img.hasAttribute('data-fixed')) {
        console.log('Adding CSP workaround for image:', img.src);
        // Mark as fixed to prevent infinite loops
        img.setAttribute('data-fixed', 'true');
        
        // Use a data attribute to store the original URL
        img.setAttribute('data-original-src', img.src);
        
        // Set a fallback image
        img.onerror = function() {
          console.log('Image failed to load, using fallback');
          this.src = '/images/fallback-cat.jpg';
        };
      }
    });
    
    console.log('CSP fix script completed');
  });
})();
