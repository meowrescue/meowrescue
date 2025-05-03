// Enhanced fixHtml logic with more complete content
function fixHtml(route, html) {
  const extractedTitle = html.match(/<title>(.*?)<\/title>/i)?.[1] || "MeowRescue - Cat Adoption & Foster Care";
  const extractedContent = html.match(/<div id="root">(.*?)<\/div>/s)?.[1] || "";
  
  // Extract any H1 content if available
  const extractedH1 = extractedContent.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1] || "Meow Rescue - Cat Adoption & Foster Care";
  const extractedH2 = extractedContent.match(/<h2[^>]*>(.*?)<\/h2>/s)?.[1] || "Find Your Perfect Feline Companion";
  
  // Create complete navigation with all links to ensure SEO
  let navigationLinks = `
    <li><a href="/">Home</a></li>
    <li><a href="/about">About Us</a></li>
    <li><a href="/cats">Adoptable Cats</a></li>
    <li><a href="/adopt">Adoption Process</a></li>
    <li><a href="/donate">Donate</a></li>
    <li><a href="/volunteer">Volunteer</a></li>
    <li><a href="/foster">Foster</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/events">Events</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="/resources">Resources</a></li>
    <li><a href="/success-stories">Success Stories</a></li>
    <li><a href="/lost-found">Lost & Found</a></li>
    <li><a href="/terms-of-service">Terms of Service</a></li>
    <li><a href="/privacy-policy">Privacy Policy</a></li>
  `;
  
  // Extract footer content if possible, otherwise provide a comprehensive fallback
  const extractedFooterSection = html.match(/<footer[^>]*>(.*?)<\/footer>/s)?.[1] || "";
  
  // Create a complete footer with ALL footer links matching the actual app
  const fallbackFooter = `
    <footer class="bg-primary text-white py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- About Section -->
          <div>
            <a href="/" class="inline-flex items-center mb-4">
              <div class="bg-white rounded-full p-2 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-primary">
                  <path d="M18 9c0 3.314-4 6-6 4-2 2-6-.686-6-4a4 4 0 0 1 8 0Z"/>
                  <path d="M10 9a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 0 0 2 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/>
                  <path d="M14 9a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1 1 1 0 0 1 0 2 1 1 0 0 0-1 1v1a1 1 0 0 1-1 1"/>
                  <path d="M2 12h1"/>
                  <path d="M21 12h1"/>
                </svg>
              </div>
              <span class="text-xl font-bold">
                <span class="text-white">Meow</span>
                <span class="text-accent">Rescue</span>
              </span>
            </a>
            <p class="mb-4 text-white/80">
              A home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need.
            </p>
            <div class="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-white"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-white"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>

          <!-- Quick Links Section - Two columns -->
          <div class="md:col-span-2">
            <h3 class="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Quick Links</h3>
            <div class="grid grid-cols-2 gap-4">
              <!-- First column of links -->
              <ul class="space-y-2">
                <li><a href="/" class="text-white/80 hover:text-white">Home</a></li>
                <li><a href="/about" class="text-white/80 hover:text-white">About Us</a></li>
                <li><a href="/cats" class="text-white/80 hover:text-white">Adoptable Cats</a></li>
                <li><a href="/adopt" class="text-white/80 hover:text-white">Adoption Process</a></li>
                <li><a href="/success-stories" class="text-white/80 hover:text-white">Success Stories</a></li>
                <li><a href="/volunteer" class="text-white/80 hover:text-white">Volunteer</a></li>
              </ul>
              
              <!-- Second column of links -->
              <ul class="space-y-2">
                <li><a href="/foster" class="text-white/80 hover:text-white">Foster</a></li>
                <li><a href="/donate" class="text-white/80 hover:text-white">Donate</a></li>
                <li><a href="/events" class="text-white/80 hover:text-white">Events</a></li>
                <li><a href="/blog" class="text-white/80 hover:text-white">Blog</a></li>
                <li><a href="/lost-found" class="text-white/80 hover:text-white">Lost & Found</a></li>
                <li><a href="/contact" class="text-white/80 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Contact Us</h3>
            <ul class="space-y-3">
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-2 text-accent">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="tel:7272570037" class="text-white/80 hover:text-white">(727) 257-0037</a>
              </li>
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-2 text-accent">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <a href="mailto:info@meowrescue.org" class="text-white/80 hover:text-white">info@meowrescue.org</a>
              </li>
            </ul>

            <div class="mt-6">
              <h4 class="font-semibold mb-2">Support Our Mission</h4>
              <a href="/donate">
                <button class="bg-accent px-4 py-2 rounded flex items-center text-white hover:bg-accent/90 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-2 text-white">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                  <span>Donate Now</span>
                </button>
              </a>
            </div>
          </div>
        </div>

        <div class="border-t border-white/20 mt-8 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="mb-4 md:mb-0 text-center md:text-left space-y-2">
              <p class="text-white/80">
                &copy; 2025 Meow Rescue Network, Inc.
                <span class="block text-sm">DBA: Meow Rescue</span>
                <span class="block text-sm">License #: FL-12345</span>
              </p>
            </div>
            <div class="flex space-x-4">
              <a href="/privacy-policy" class="text-white/80 hover:text-white">Privacy Policy</a>
              <a href="/terms-of-service" class="text-white/80 hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `;
  
  // Create full navigation header for SEO
  const fullNavHeader = `
    <header class="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a href="/" class="flex items-center gap-2">
            <div class="bg-primary rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-white">
                <path d="M18 9c0 3.314-4 6-6 4-2 2-6-.686-6-4a4 4 0 0 1 8 0Z"/>
                <path d="M10 9a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 0 0 2 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/>
                <path d="M14 9a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1 1 1 0 0 1 0 2 1 1 0 0 0-1 1v1a1 1 0 0 1-1 1"/>
                <path d="M2 12h1"/>
                <path d="M21 12h1"/>
              </svg>
            </div>
            <span class="font-bold text-xl">
              <span class="text-primary">Meow</span>
              <span class="text-accent">Rescue</span>
            </span>
          </a>
          
          <!-- Desktop Navigation -->
          <nav class="hidden lg:block overflow-visible">
            <ul class="flex items-center space-x-6">
              <li class="relative"><a href="/" class="font-medium transition-colors px-2 py-1 block relative group">Home</a></li>
              <li class="relative"><a href="/about" class="font-medium transition-colors px-2 py-1 block relative group">About</a></li>
              <li class="relative">
                <button class="inline-flex items-center gap-2 font-medium transition-colors px-2 py-1 relative group">
                  <span>Adopt</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>
                <div class="hidden">
                  <a href="/cats" class="block px-5 py-2.5 text-sm">Adoptable Cats</a>
                  <a href="/adopt" class="block px-5 py-2.5 text-sm">Adoption Process</a>
                  <a href="/success-stories" class="block px-5 py-2.5 text-sm">Success Stories</a>
                </div>
              </li>
              <li class="relative">
                <button class="inline-flex items-center gap-2 font-medium transition-colors px-2 py-1 relative group">
                  <span>Get Involved</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>
                <div class="hidden">
                  <a href="/volunteer" class="block px-5 py-2.5 text-sm">Volunteer</a>
                  <a href="/foster" class="block px-5 py-2.5 text-sm">Foster</a>
                  <a href="/donate" class="block px-5 py-2.5 text-sm">Donate</a>
                </div>
              </li>
              <li class="relative">
                <button class="inline-flex items-center gap-2 font-medium transition-colors px-2 py-1 relative group">
                  <span>Resources</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>
                <div class="hidden">
                  <a href="/resources" class="block px-5 py-2.5 text-sm">Cat Care Tips</a>
                  <a href="/lost-found" class="block px-5 py-2.5 text-sm">Lost & Found</a>
                </div>
              </li>
              <li class="relative"><a href="/events" class="font-medium transition-colors px-2 py-1 block relative group">Events</a></li>
              <li class="relative"><a href="/blog" class="font-medium transition-colors px-2 py-1 block relative group">Blog</a></li>
              <li class="relative"><a href="/contact" class="font-medium transition-colors px-2 py-1 block relative group">Contact</a></li>
            </ul>
          </nav>
          
          <!-- Right Side -->
          <div class="flex items-center gap-2">
            <a href="/donate">
              <button class="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-white bg-accent rounded-md shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 h-4 w-4">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
                Donate
              </button>
            </a>
            <a href="/login">
              <button class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-transparent rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 h-4 w-4">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line>
                </svg>
                Login
              </button>
            </a>
            <button class="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                <line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
  
  const footerContent = extractedFooterSection || fallbackFooter;
  const headerContent = html.match(/<header[^>]*>[\s\S]*?<\/header>/i)?.[0] || fullNavHeader;
  
  // Compose a "fixed" html string with guaranteed SEO elements and complete content
  let htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${extractedTitle}</title>
    <meta name="description" content="MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need." />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href="https://meowrescue.org${route}" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta property="og:title" content="${extractedTitle}" />
    <meta property="og:description" content="MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://meowrescue.org${route}" />
    <meta property="og:image" content="https://meowrescue.org/images/meow-rescue-logo.jpg" />
    <meta property="og:updated_time" content="2025-04-21T12:00:00Z" />
    <meta name="last-modified" content="2025-04-21T12:00:00Z" />
    <meta http-equiv="last-modified" content="2025-04-21T12:00:00Z" />
    <link rel="stylesheet" href="/assets/index.css">
    
    <!-- Fallback mobile styles -->
    <style>
      @media (max-width: 768px) {
        body {
          font-size: 16px;
          padding: 0;
          margin: 0;
        }
        h1 {
          font-size: 1.8rem;
        }
        h2 {
          font-size: 1.5rem;
        }
      }
    </style>
    
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Meow Rescue",
        "url": "https://meowrescue.org",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://meowrescue.org/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "dateModified": "2025-04-21T12:00:00Z"
      }
    </script>
  </head>
  <body>
    <!-- Ensure fallback content for SEO -->
    <div class="fallback-content" style="display:none">
      <h1>${extractedH1}</h1>
      <p>MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need.</p>
      <h2>${extractedH2}</h2>
      <nav>
        <ul>${navigationLinks}</ul>
      </nav>
      ${footerContent}
    </div>
    
    <div id="root" data-reactroot="">
      <!-- Ensure header is included for SEO -->
      ${headerContent}
      
      <!-- Main content -->
      ${extractedContent}
      
      <!-- Ensure footer is included for SEO -->
      ${footerContent}
    </div>
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({queryClient: {}})};
    </script>
    <script src="https://cdn.gpteng.co/gptengineer.min.js" type="module"></script>
    <script type="module" src="/assets/main.js"></script>
    <script type="module">
      import React from 'react';
      import ReactDOM from 'react-dom/client';
      import App from '../App.tsx';
      
      // Hydrate the prerendered content
      const root = ReactDOM.hydrateRoot(document.getElementById('root'), <App />);
    </script>
  </body>
</html>`;

  return htmlContent;
}

export { fixHtml };
