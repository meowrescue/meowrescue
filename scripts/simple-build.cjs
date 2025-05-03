// Simple build script for Meow Rescue SSG
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const rootDir = process.cwd();

// Function to clean previous build
const cleanPreviousBuild = () => {
  console.log('🧹 Cleaning previous build...');
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
};

// Function to build client application
const buildClientApp = async () => {
  console.log('📦 Building the client application...');
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npx', ['vite', 'build'], { stdio: 'inherit', shell: true, cwd: rootDir, env: { ...process.env, NODE_ENV: 'production' } });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Client application built successfully!');
        resolve();
      } else {
        console.error('❌ Build failed with exit code:', code);
        reject(new Error(`Build process exited with code ${code}`));
      }
    });
    
    buildProcess.on('error', (err) => {
      console.error('❌ Error during build:', err);
      reject(err);
    });
  });
};

// Function to prerender all public pages
const prerenderPages = async () => {
  console.log('🚀 Starting prerendering of public pages...');
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
    console.log('✅ Puppeteer is already installed.');
  } catch (error) {
    console.log('🛠 Installing puppeteer...');
    const installProcess = spawn('npm', ['install', 'puppeteer'], { stdio: 'inherit', shell: true });
    await new Promise((resolve, reject) => {
      installProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Puppeteer installed successfully!');
          puppeteer = require('puppeteer');
          resolve();
        } else {
          console.error('❌ Failed to install puppeteer with exit code:', code);
          reject(new Error(`Installation failed with code ${code}`));
        }
      });
      installProcess.on('error', (err) => {
        console.error('❌ Error installing puppeteer:', err);
        reject(err);
      });
    });
  }
  
  // Array of base routes to start crawling from - ensuring all public pages are included
  const baseRoutes = [
    "/",
    "/about",
    "/cats",
    "/adopt",
    "/volunteer",
    "/volunteer/apply",
    "/foster",
    "/foster/apply",
    "/donate",
    "/events",
    "/blog",
    "/contact",
    "/resources",
    "/success-stories",
    "/financial-transparency",
    "/lost-found",
    "/privacy-policy",
    "/terms-of-service",
    "/faq",
    "/wishlist"
  ];
  
  // Function to fetch dynamic routes from the site
  const fetchDynamicRoutes = async (baseRoute, visited = new Set()) => {
    console.log(`Fetching dynamic routes for ${baseRoute}...`);
    try {
      const serverUrl = `http://localhost:${serverPort}${baseRoute}`;
      console.log(`Navigating to ${serverUrl}`);
      await page.goto(serverUrl, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'], timeout: 60000 });
      await page.waitForFunction('document.querySelector("#root").innerText.length > 0', { timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 3000)); // Reduced from 10 seconds to 3 seconds for faster builds
      const links = await page.evaluate((base, port) => {
        return Array.from(document.querySelectorAll('a[href]'))
          .filter(a => a.href.startsWith(`http://localhost:${port}`) && !a.href.includes('/login') && !a.href.includes('/register') && !a.href.includes('/reset-password'))
          .map(a => {
            const href = a.href.replace(`http://localhost:${port}`, '');
            // Strip any hash fragments from the route
            const cleanHref = href.split('#')[0];
            return {
              route: cleanHref,
              title: `${a.textContent.trim()} - Meow Rescue`,
              description: `Learn more about ${a.textContent.trim()} at Meow Rescue.`
            };
          });
      }, baseRoute, serverPort);
      console.log(`Found ${links.length} dynamic routes for ${baseRoute}`);
      
      let allLinks = links;
      for (const link of links) {
        if (!visited.has(link.route)) {
          visited.add(link.route);
          const subLinks = await fetchDynamicRoutes(link.route, visited);
          allLinks = allLinks.concat(subLinks);
        }
      }
      return allLinks;
    } catch (error) {
      console.error(`Error fetching dynamic routes for ${baseRoute}:`, error);
      return [];
    }
  };
  
  // Start a temporary Vite server for rendering
  console.log('Starting temporary Vite server for prerendering...');
  let serverProcess;
  let serverStarted = false;
  let serverPort = 5173; // Default port
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      serverProcess = spawn('npx', ['vite', '--port', serverPort.toString()], { stdio: ['inherit', 'pipe', 'pipe'], shell: true, cwd: rootDir, env: { ...process.env, NODE_ENV: 'development' } });
      console.log(`Attempt ${attempt}/3 to start Vite server on port ${serverPort}...`);
      await new Promise((resolve, reject) => {
        if (serverProcess.stdout) {
          serverProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(output);
            if (output.includes('ready in') || output.includes('http://localhost:')) {
              console.log('✅ Vite server started!');
              serverStarted = true;
              // Extract the actual port from the output
              const portMatch = output.match(/http:\/\/localhost:(\d+)/);
              if (portMatch && portMatch[1]) {
                serverPort = parseInt(portMatch[1], 10);
                console.log(`Detected Vite server running on port ${serverPort}`);
              }
              resolve();
            }
          });
        } else {
          console.error('stdout is null, cannot attach event listener');
        }

        if (serverProcess.stderr) {
          serverProcess.stderr.on('data', (data) => {
            console.error(data.toString());
          });
        } else {
          console.error('stderr is null, cannot attach event listener');
        }

        serverProcess.on('error', (err) => {
          console.error('❌ Server process error:', err);
          reject(err);
        });

        serverProcess.on('close', (code) => {
          console.log(`Server process exited with code ${code}`);
          reject(new Error(`Server process exited with code ${code}`));
        });
      });
      if (serverStarted) break;
    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed:`, err);
      if (serverProcess) serverProcess.kill();
      if (attempt === 3) {
        console.error('❌ Failed to start server after 3 attempts. Aborting prerendering.');
        return;
      }
      // Try a different port on the next attempt
      serverPort = 5173 + attempt;
      console.log(`Trying a different port (${serverPort}) on next attempt...`);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retry
    }
  }
  
  if (!serverStarted) {
    console.error('❌ Server did not start. Prerendering cannot proceed.');
    return;
  }
  
  // Give additional time for server stability
  await new Promise(resolve => setTimeout(resolve, 3000)); // Reduced from 10 seconds to 3 seconds
  
  // Launch puppeteer browser
  console.log('Launching Puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 60000
  });
  console.log('✅ Puppeteer browser launched!');
  const page = await browser.newPage();
  
  // Set a reasonable viewport
  await page.setViewport({ width: 1280, height: 720 });
  
  // Collect all dynamic routes
  console.log('Collecting all dynamic routes from base pages...');
  let dynamicRoutes = {};
  const globalVisited = new Set();
  for (const baseRoute of baseRoutes) {
    if (!globalVisited.has(baseRoute)) {
      globalVisited.add(baseRoute);
      const links = await fetchDynamicRoutes(baseRoute, globalVisited);
      links.forEach(link => {
        dynamicRoutes[link.route] = link;
      });
    } else {
      console.log(`Skipping already visited base route: ${baseRoute}`);
    }
  }
  
  // Combine all routes
  const allRoutes = { ...baseRoutes.reduce((acc, route) => ({ ...acc, [route]: { title: `Meow Rescue - ${route}`, description: `Learn more about ${route} at Meow Rescue.` } }), {}), ...dynamicRoutes };
  const outputDir = path.join(process.cwd(), 'dist');
  
  for (const [route, metadata] of Object.entries(allRoutes)) {
    console.log(`Prerendering ${route}...`);
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        console.log(`Navigating to http://localhost:${serverPort}${route} (Attempt ${attempt}/5)`);
        const response = await page.goto(`http://localhost:${serverPort}${route}`, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'], timeout: 60000 });
        if (!response.ok()) {
          console.warn(`⚠️ Warning: HTTP status ${response.status()} for ${route}`);
        }
        
        // Wait for the #root element to have content
        await page.waitForFunction('document.querySelector("#root").innerText.length > 0', { timeout: 60000 });
        // Additional wait time for dynamic content - reduced to 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Get the full HTML content
        const htmlContent = await page.content();
        console.log(`HTML content length for ${route}: ${htmlContent.length}`);
        
        // Determine the file path
        let filePath;
        if (route === '/') {
          filePath = path.join(outputDir, 'index.html');
        } else {
          filePath = path.join(outputDir, `${route.slice(1)}.html`);
        }
        
        // Ensure the directory exists
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        
        // Write the HTML content to file
        fs.writeFileSync(filePath, htmlContent, 'utf8');
        console.log(`✅ Successfully prerendered ${route} to ${filePath}`);
        break; // Exit retry loop on success
      } catch (error) {
        console.error(`❌ Error prerendering ${route} on attempt ${attempt}:`, error);
        if (attempt === 5) {
          console.error(`❌ Failed to prerender ${route} after 5 attempts.`);
        }
        await new Promise(resolve => setTimeout(resolve, 5000 * attempt)); // Exponential backoff
      }
    }
  }
  
  console.log('Closing Puppeteer browser...');
  await browser.close();
  console.log('✅ Puppeteer browser closed.');
  
  console.log('Stopping temporary Vite server...');
  if (serverProcess) {
    serverProcess.kill();
  }
  console.log('✅ Prerendering completed!');
  
  // Generate sitemap with all discovered routes
  generateSitemap(Object.keys(allRoutes));
};

// Function to generate sitemap.xml
const generateSitemap = (routes) => {
  console.log('🗺️ Generating sitemap.xml...');
  const today = new Date().toISOString().split('T')[0];
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes.map(route => {
  // Strip any hash fragments from the route for sitemap
  const cleanRoute = route.split('#')[0];
  const loc = cleanRoute === '/' ? 'https://meowrescue.org/' : `https://meowrescue.org${cleanRoute}`;
  const priority = cleanRoute === '/' ? '1.0' : cleanRoute.includes('/cats/') || cleanRoute.includes('/blog/') ? '0.9' : '0.8';
  const changefreq = cleanRoute.includes('/cats/') || cleanRoute.includes('/blog/') || cleanRoute.includes('/events/') ? 'daily' : 'weekly';
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="es" href="https://meowrescue.org/es${cleanRoute}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />
  </url>`;
}).join('\n')}
</urlset>`;
  
  const outputDir = path.join(process.cwd(), 'dist');
  fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemapContent, 'utf8');
  console.log('✅ Sitemap generated!');
};

// Function to generate robots.txt
const generateRobotsTxt = () => {
  console.log('📝 Generating robots.txt...');
  const robotsContent = `# Meow Rescue Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: https://meowrescue.org/sitemap.xml
`;
  const outputDir = path.join(process.cwd(), 'dist');
  fs.writeFileSync(path.join(outputDir, 'robots.txt'), robotsContent, 'utf8');
  console.log('✅ Robots.txt generated!');
};

// Main build function
const main = async () => {
  try {
    console.log('🚀 Starting simple build process...');
    // Clean previous build
    cleanPreviousBuild();
    
    // Build the client application
    await buildClientApp();
    
    // Prerender all public pages
    await prerenderPages();
    
    // Generate robots.txt
    generateRobotsTxt();
    
    console.log('🎉 Build process completed successfully!');
    process.exit(0); // Ensure the script terminates
  } catch (error) {
    console.error('❌ Build process failed:', error);
    process.exit(1);
  }
};

// Run the build process
main().catch(err => {
  console.error('Build process failed:', err);
  process.exit(1);
});
