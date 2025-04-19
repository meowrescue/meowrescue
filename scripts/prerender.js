import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';

// Convert ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the static paths to pre-render
const staticPaths = [
  '/',
  '/about',
  '/cats',
  '/adopt',
  '/adopt/apply',
  '/blog',
  '/events',
  '/resources',
  '/contact',
  '/donate',
  '/volunteer',
  '/volunteer/apply',
  '/foster',
  '/foster/apply',
  '/login',
  '/register',
  '/reset-password',
  '/privacy-policy',
  '/terms-of-service',
  '/lost-found',
  '/404',
];

// Use puppeteer to prerender the pages
async function prerender() {
  console.log('Starting pre-rendering process...');
  
  const distPath = path.resolve(__dirname, '../dist');
  const indexHtmlPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error('Build directory does not contain index.html. Make sure to run this after the build.');
  }
  
  // Start a static file server for puppeteer to access
  const server = await startStaticServer(distPath);
  const PORT = 8954; // Random port for our local server
  const baseUrl = `http://localhost:${PORT}`;
  
  // Launch puppeteer
  const browser = await puppeteer.launch({ headless: 'new' });
  
  try {
    // Process each path
    for (const pagePath of staticPaths) {
      console.log(`Pre-rendering ${pagePath}...`);
      
      // Calculate the output directory and file path
      const outputPath = pagePath === '/' 
        ? path.join(distPath, 'index.html')
        : path.join(distPath, pagePath.substring(1), 'index.html');
      
      // Make sure the directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Open the page in puppeteer
      const page = await browser.newPage();
      await page.goto(`${baseUrl}${pagePath}`, { waitUntil: 'networkidle0' });
      
      // Wait for React to render the content (adjust selectors as needed)
      await page.waitForSelector('#root > *', { timeout: 5000 }).catch(() => {
        console.warn(`Warning: Could not find content in #root for ${pagePath}`);
      });
      
      // Get the fully rendered HTML
      const renderedHtml = await page.content();
      
      // Clean up the HTML to remove any browser-specific attributes
      const dom = new JSDOM(renderedHtml);
      
      // Ensure scripts still load correctly in the pre-rendered HTML
      const scriptElements = dom.window.document.querySelectorAll('script');
      scriptElements.forEach(script => {
        if (script.getAttribute('src') && script.getAttribute('src').startsWith('/assets/')) {
          // Keep these scripts as is
        } else if (script.textContent.includes('__vite_is_modern_browser')) {
          // Keep Vite's detection scripts
        } else {
          // Remove inline scripts that might interfere with hydration
          // script.remove();
        }
      });
      
      // Write the pre-rendered HTML to file
      fs.writeFileSync(outputPath, dom.serialize());
      
      // Close the page
      await page.close();
      
      console.log(`Pre-rendered ${pagePath} → ${outputPath}`);
    }
  } finally {
    // Clean up resources
    await browser.close();
    server.close();
    console.log('Pre-rendering complete!');
  }
}

// Start a simple HTTP server to serve the static files
function startStaticServer(distPath) {
  const server = createServer((req, res) => {
    let url = req.url === '/' ? '/index.html' : req.url;
    
    // For routes like /about, serve /about/index.html
    if (!url.includes('.')) {
      url = `${url}/index.html`.replace('//', '/');
    }
    
    const filePath = path.join(distPath, url);
    
    // For routes like /about, redirect to /about/
    if (!fs.existsSync(filePath) && !url.endsWith('/index.html')) {
      const indexPath = path.join(distPath, url.substring(1), 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(indexPath));
        return;
      }
    }
    
    // Serve the file if it exists
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      }[ext] || 'application/octet-stream';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404);
      res.end('File not found');
    }
  });
  
  const PORT = 8954;
  server.listen(PORT);
  console.log(`Static server started on port ${PORT}`);
  
  return server;
}

prerender().catch(error => {
  console.error('Pre-rendering failed:', error);
  process.exit(1);
});
