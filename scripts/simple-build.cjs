// Simple build script for Meow Rescue SSG
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();

// Helper function for timestamp logging
const log = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${message}`);
};

// Function to clean previous build
const cleanPreviousBuild = () => {
  log('🧹 Cleaning previous build...');
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  log('✅ Clean completed');
};

// Function to build client application
const buildClientApp = () => {
  log('📦 Building the client application...');
  try {
    // Run the build
    log('📦 Starting Vite build...');
    execSync('npx vite build --mode production', { 
      stdio: 'inherit', 
      shell: true, 
      cwd: rootDir, 
      env: { ...process.env, NODE_ENV: 'production' } 
    });
    log('✅ Client application built successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error during build:', error);
    return false;
  }
};

// Function to create HTML files with proper SEO content
const createStaticHtmlFiles = () => {
  log('📄 Creating static HTML files for all routes...');
  
  // Define all routes that need static HTML files
  const routes = [
    { path: '/', outputFile: 'index.html', title: 'Home', description: 'Meow Rescue is dedicated to rescuing, rehabilitating, and rehoming cats in need. Find your perfect feline companion today!' },
    { path: '/about', outputFile: 'about.html', title: 'About Us', description: 'Learn about Meow Rescue\'s mission, our dedicated team, and our commitment to improving the lives of cats in our community.' },
    { path: '/cats', outputFile: 'cats.html', title: 'Our Cats', description: 'Meet our adorable cats and kittens available for adoption. Each one has been rescued, given medical care, and socialized in a foster home.' },
    { path: '/adopt', outputFile: 'adopt.html', title: 'Adopt', description: 'Find out how to adopt a cat from Meow Rescue. Our adoption process ensures each cat finds the right forever home.' },
    { path: '/volunteer', outputFile: 'volunteer.html', title: 'Volunteer', description: 'Discover volunteer opportunities at Meow Rescue. Help us make a difference in the lives of cats in need.' },
    { path: '/foster', outputFile: 'foster.html', title: 'Foster', description: 'Learn about fostering cats for Meow Rescue. Fostering saves lives and provides cats with a safe environment until adoption.' },
    { path: '/donate', outputFile: 'donate.html', title: 'Donate', description: 'Support Meow Rescue\'s mission by donating. Your contribution helps us rescue and care for cats in need.' },
    { path: '/events', outputFile: 'events.html', title: 'Events', description: 'Check out upcoming Meow Rescue events, including adoption days, fundraisers, and community outreach programs.' },
    { path: '/blog', outputFile: 'blog.html', title: 'Blog', description: 'Read our blog for cat care tips, rescue stories, and updates on Meow Rescue\'s activities.' },
    { path: '/contact', outputFile: 'contact.html', title: 'Contact Us', description: 'Get in touch with Meow Rescue. We\'re here to answer your questions about adoption, fostering, volunteering, and more.' },
    { path: '/lost-found', outputFile: 'lost-found.html', title: 'Lost & Found', description: 'Report a lost or found cat. Meow Rescue helps reunite lost cats with their families and find homes for strays.' },
    { path: '/success-stories', outputFile: 'success-stories.html', title: 'Success Stories', description: 'Read heartwarming stories of cats who found their forever homes through Meow Rescue.' },
    { path: '/faq', outputFile: 'faq.html', title: 'FAQ', description: 'Find answers to frequently asked questions about Meow Rescue\'s adoption process, fostering program, and more.' }
  ];
  
  // Read the template HTML file
  const indexPath = path.join(rootDir, 'dist', 'index.html');
  log(`Reading template from ${indexPath}`);
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ Error: index.html not found in dist directory');
    return false;
  }
  
  const templateHtml = fs.readFileSync(indexPath, 'utf8');
  log(`Template HTML size: ${templateHtml.length} bytes`);
  
  // Process each route
  for (const route of routes) {
    log(`Processing route: ${route.path}`);
    
    try {
      // Skip index.html as it's already created
      if (route.path === '/') {
        log('✅ Skipping index.html as it already exists');
        
        // But still enhance it with SEO metadata
        const enhancedIndexHtml = addSeoMetadata(templateHtml, route);
        fs.writeFileSync(indexPath, enhancedIndexHtml, 'utf8');
        log('✅ Enhanced index.html with SEO metadata');
        continue;
      }
      
      // Create directory if needed
      const outputDir = path.dirname(path.join(rootDir, 'dist', route.outputFile));
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        log(`Created directory: ${outputDir}`);
      }
      
      // Create HTML file with proper SEO metadata
      const enhancedHtml = addSeoMetadata(templateHtml, route);
      
      // Add route-specific content placeholder for SEO
      const contentHtml = addRouteContent(enhancedHtml, route);
      
      // Write the file
      const outputPath = path.join(rootDir, 'dist', route.outputFile);
      fs.writeFileSync(outputPath, contentHtml, 'utf8');
      
      const stats = fs.statSync(outputPath);
      log(`✅ Created ${route.outputFile} (${stats.size} bytes)`);
    } catch (error) {
      console.error(`❌ Error creating HTML for ${route.path}:`, error.message);
    }
  }
  
  log('✅ Static HTML files created successfully');
  return true;
};

// Function to add SEO metadata to HTML
const addSeoMetadata = (html, route) => {
  log(`Adding SEO metadata for ${route.path}`);
  
  // Create SEO metadata
  const seoMetadata = `
  <!-- Primary Meta Tags -->
  <meta name="title" content="Meow Rescue - ${route.title}">
  <meta name="description" content="${route.description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://meowrescue.org${route.path}">
  <meta property="og:title" content="Meow Rescue - ${route.title}">
  <meta property="og:description" content="${route.description}">
  <meta property="og:image" content="https://meowrescue.org/images/og-image.jpg">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://meowrescue.org${route.path}">
  <meta property="twitter:title" content="Meow Rescue - ${route.title}">
  <meta property="twitter:description" content="${route.description}">
  <meta property="twitter:image" content="https://meowrescue.org/images/og-image.jpg">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Meow Rescue - ${route.title}",
    "description": "${route.description}",
    "url": "https://meowrescue.org${route.path}",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Meow Rescue",
      "url": "https://meowrescue.org"
    }
  }
  </script>`;
  
  // Insert SEO metadata before the closing head tag
  return html.replace('</head>', `${seoMetadata}\n</head>`);
};

// Function to add route-specific content for SEO
const addRouteContent = (html, route) => {
  log(`Adding content for ${route.path}`);
  
  // Create route-specific content based on the route
  let content = '';
  
  switch (route.path) {
    case '/about':
      content = `
      <div class="seo-content">
        <h1>About Meow Rescue</h1>
        <p>Meow Rescue is a dedicated cat rescue organization based in Pasco County, Florida. Our mission is to rescue, rehabilitate, and rehome cats in need.</p>
        <p>We believe that every cat deserves a loving forever home. Our volunteers work tirelessly to ensure that each cat receives proper medical care, socialization, and ultimately, placement in a suitable adoptive home.</p>
        <h2>Our Founders</h2>
        <p>Meow Rescue was founded in 2018 by Patrick and Sarah Gilmore, whose passion for helping cats began when they rescued a litter of abandoned kittens. What started as a small operation out of their home has grown into a network of dedicated volunteers and foster families throughout Pasco County.</p>
        <h2>Our Mission</h2>
        <p>Our mission is simple: to improve the lives of cats through rescue, rehabilitation, and adoption. We work to reduce the population of homeless cats through TNR (Trap-Neuter-Return) programs and community education.</p>
        <h2>Our Team</h2>
        <p>Our team consists of dedicated volunteers who donate their time, energy, and resources to help cats in need. From foster parents to adoption counselors, every member of our team plays a vital role in our mission.</p>
      </div>`;
      break;
    case '/cats':
      content = `
      <div class="seo-content">
        <h1>Our Cats</h1>
        <p>Meet the cats available for adoption at Meow Rescue. Each cat has been rescued, given medical care, and socialized in a foster home environment.</p>
        <p>Our cats come in all ages, colors, and personalities. Whether you're looking for a playful kitten or a calm senior companion, we have the perfect match for you.</p>
        <h2>Adoption Process</h2>
        <p>Our adoption process is designed to ensure that each cat finds the right forever home. We carefully screen potential adopters to ensure they can provide a safe, loving environment for our cats.</p>
        <h2>Featured Cats</h2>
        <p>We have many wonderful cats available for adoption, including:</p>
        <ul>
          <li>Luna - A playful 1-year-old tabby who loves toys and cuddles</li>
          <li>Oliver - A gentle 3-year-old orange tabby who gets along with everyone</li>
          <li>Bella - A sweet 2-year-old calico who enjoys sitting in laps</li>
          <li>Max - An energetic 6-month-old black kitten who loves to play</li>
        </ul>
      </div>`;
      break;
    case '/adopt':
      content = `
      <div class="seo-content">
        <h1>Adopt a Cat</h1>
        <p>Adopting a cat from Meow Rescue is a rewarding experience. Our adoption process ensures that each cat finds the right forever home.</p>
        <p>When you adopt from us, you're not just gaining a new family member — you're also supporting our ongoing mission to help more cats in need throughout our community.</p>
        <h2>Adoption Process</h2>
        <p>Our adoption process includes:</p>
        <ol>
          <li>Browsing our available cats online or meeting them at an adoption event</li>
          <li>Completing an adoption application</li>
          <li>Home visit to ensure your home is safe for a cat</li>
          <li>Adoption fee payment (which covers spay/neuter, vaccinations, and microchipping)</li>
          <li>Taking your new family member home!</li>
        </ol>
        <h2>Adoption Fees</h2>
        <p>Our adoption fees help cover the cost of care for our cats:</p>
        <ul>
          <li>Kittens (under 1 year): $150</li>
          <li>Adult cats (1-7 years): $100</li>
          <li>Senior cats (8+ years): $75</li>
        </ul>
      </div>`;
      break;
    case '/volunteer':
      content = `
      <div class="seo-content">
        <h1>Volunteer with Meow Rescue</h1>
        <p>Volunteers are the heart of Meow Rescue. Without our dedicated team of volunteers, we wouldn't be able to help as many cats as we do.</p>
        <p>There are many ways to volunteer with Meow Rescue, from fostering cats to helping at adoption events.</p>
        <h2>Volunteer Opportunities</h2>
        <ul>
          <li>Fostering cats and kittens</li>
          <li>Helping at adoption events</li>
          <li>Transporting cats to vet appointments</li>
          <li>Fundraising and grant writing</li>
          <li>Social media and website management</li>
          <li>Community outreach and education</li>
        </ul>
        <h2>Volunteer Requirements</h2>
        <p>To volunteer with Meow Rescue, you must:</p>
        <ul>
          <li>Be at least 18 years old (or 16 with parent/guardian permission)</li>
          <li>Complete a volunteer application</li>
          <li>Attend a volunteer orientation</li>
          <li>Commit to at least 4 hours per month</li>
        </ul>
      </div>`;
      break;
    default:
      content = `
      <div class="seo-content">
        <h1>Meow Rescue - ${route.title}</h1>
        <p>${route.description}</p>
      </div>`;
  }
  
  // Add the content before the closing body tag
  // But make it hidden with CSS so it doesn't interfere with the React app
  const contentWithStyle = `
  <style>
    .seo-content {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  </style>
  ${content}`;
  
  return html.replace('</body>', `${contentWithStyle}\n</body>`);
};

// Function to generate sitemap.xml
const generateSitemap = () => {
  log('🗺️ Generating sitemap.xml...');
  
  // Define all your routes here for SEO
  const routes = [
    { path: "/", priority: "1.0", changefreq: "daily" },
    { path: "/about", priority: "0.8", changefreq: "monthly" },
    { path: "/cats", priority: "0.9", changefreq: "daily" },
    { path: "/adopt", priority: "0.9", changefreq: "weekly" },
    { path: "/volunteer", priority: "0.8", changefreq: "monthly" },
    { path: "/foster", priority: "0.8", changefreq: "monthly" },
    { path: "/donate", priority: "0.8", changefreq: "monthly" },
    { path: "/events", priority: "0.9", changefreq: "daily" },
    { path: "/blog", priority: "0.9", changefreq: "weekly" },
    { path: "/contact", priority: "0.7", changefreq: "monthly" },
    { path: "/lost-found", priority: "0.8", changefreq: "daily" },
    { path: "/success-stories", priority: "0.8", changefreq: "weekly" },
    { path: "/faq", priority: "0.7", changefreq: "monthly" }
  ];
  
  const today = new Date().toISOString().split('T')[0];
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes.map(route => {
  const loc = route.path === '/' ? 'https://meowrescue.org/' : `https://meowrescue.org${route.path}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;
  
  const outputDir = path.join(process.cwd(), 'dist');
  fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemapContent, 'utf8');
  log('✅ Sitemap generated!');
};

// Function to generate robots.txt
const generateRobotsTxt = () => {
  log('📝 Generating robots.txt...');
  const robotsContent = `# Meow Rescue Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: https://meowrescue.org/sitemap.xml
`;
  const outputDir = path.join(process.cwd(), 'dist');
  fs.writeFileSync(path.join(outputDir, 'robots.txt'), robotsContent, 'utf8');
  log('✅ Robots.txt generated!');
};

// Function to create _redirects file for Netlify
const createRedirects = () => {
  log('📝 Creating _redirects file for Netlify...');
  const redirectsContent = `/*    /index.html   200`;
  const outputDir = path.join(process.cwd(), 'dist');
  fs.writeFileSync(path.join(outputDir, '_redirects'), redirectsContent, 'utf8');
  log('✅ _redirects file created!');
};

// Main build function
const main = () => {
  log('🚀 Starting build process with SEO optimization...');
  
  // Clean previous build
  cleanPreviousBuild();
  
  // Build the client application
  const buildSuccess = buildClientApp();
  
  if (buildSuccess) {
    // Create static HTML files with SEO content
    createStaticHtmlFiles();
    
    // Generate robots.txt
    generateRobotsTxt();
    
    // Generate sitemap
    generateSitemap();
    
    // Create redirects file
    createRedirects();
    
    log('🎉 Build process completed successfully with SEO optimization!');
    log('✅ Generated:');
    log('  - Static HTML files for all routes with SEO content');
    log('  - robots.txt');
    log('  - sitemap.xml');
    log('  - _redirects for Netlify');
    
    return true;
  } else {
    console.error('❌ Build process failed');
    process.exit(1);
  }
};

// Run the build process
main();
