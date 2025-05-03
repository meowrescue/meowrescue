// clientSideNavigation.js

/**
 * Initializes client-side navigation to prevent full page reloads after static HTML loads.
 */
export function initClientSideNavigation() {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  console.log('Initializing client-side navigation');
  
  // Add event listeners to all internal links
  document.addEventListener('click', (event) => {
    const target = event.target.closest('a');
    if (!target) return;
    
    const href = target.getAttribute('href');
    // Check if it's an internal link
    if (href && href.startsWith('/')) {
      // If navigate function is available (React Router is loaded), prevent default
      if (window.navigate) {
        event.preventDefault();
        console.log(`Client-side navigating to ${href}`);
        window.navigate(href);
      }
      // Otherwise, let the default <a> tag behavior happen (static HTML navigation)
    }
  });
}
