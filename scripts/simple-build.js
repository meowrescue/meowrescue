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
          resolve();
        } else {
          console.error('❌ Failed to install puppeteer.');
          reject(new Error(`npm install puppeteer exited with code ${code}`));
        }
      });
    });
    puppeteer = require('puppeteer');
  }
  
  const routes = {
    '/': { title: 'Home - Meow Rescue', description: 'MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need.' },
    '/about': { title: 'About Us - Meow Rescue', description: 'Learn more about Meow Rescue, our mission, and our team dedicated to cat welfare in Pasco County, Florida.' },
    '/adopt': { title: 'Adopt a Cat - Meow Rescue', description: 'Find your perfect feline companion at Meow Rescue. View cats available for adoption in Pasco County, Florida.' },
    '/cats': { title: 'Our Cats - Meow Rescue', description: 'Meet all the cats at Meow Rescue waiting for their forever homes in Pasco County, Florida.' },
    '/blog': { title: 'Blog - Meow Rescue', description: 'Read the latest news, tips, and stories about cat care and rescue from Meow Rescue.' },
    '/events': { title: 'Events - Meow Rescue', description: 'Join us at upcoming events to support Meow Rescue and meet cats available for adoption.' },
    '/foster': { title: 'Foster a Cat - Meow Rescue', description: 'Become a foster parent to a cat in need with Meow Rescue in Pasco County, Florida.' },
    '/lost-found': { title: 'Lost & Found Cats - Meow Rescue', description: 'Report or search for lost and found cats in Pasco County, Florida with Meow Rescue.' },
    '/resources': { title: 'Cat Care Resources - Meow Rescue', description: 'Access helpful resources and guides for cat care and ownership from Meow Rescue.' },
    '/success-stories': { title: 'Success Stories - Meow Rescue', description: 'Read heartwarming stories of cats adopted through Meow Rescue and their new families.' },
    '/volunteer': { title: 'Volunteer - Meow Rescue', description: 'Join our team of volunteers at Meow Rescue to help cats in need in Pasco County, Florida.' },
    '/donate': { title: 'Donate - Meow Rescue', description: 'Support Meow Rescue by donating to help us rescue and care for cats in Pasco County, Florida.' },
    '/financial-transparency': { title: 'Financial Transparency - Meow Rescue', description: 'View financial reports and transparency information for Meow Rescue, ensuring trust in our operations.' }
  };
  const outputDir = path.join(process.cwd(), 'dist');
  
  // Start a temporary Vite server for rendering
  console.log('Starting temporary Vite server for prerendering...');
  let serverProcess;
  let serverStarted = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      serverProcess = spawn('npx', ['vite', 'preview', '--port', '5173'], { stdio: 'inherit', shell: true });
      console.log(`Attempt ${attempt} to start Vite server...`);
      
      // Wait for server to start by listening to output
      await new Promise((resolve, reject) => {
        serverProcess.on('error', (err) => {
          reject(err);
        });
        // Timeout in case server doesn't start
        setTimeout(() => {
          console.log('Checking if server is running...');
          // Use a simple HTTP request to check if server is up
          const http = require('http');
          http.get('http://localhost:5173', (res) => {
            console.log('Server is up and running!');
            serverStarted = true;
            resolve();
          }).on('error', () => {
            console.log('Server not yet running, will retry...');
            reject(new Error('Server not detected yet'));
          });
        }, 20000);
      });
      if (serverStarted) break;
    } catch (error) {
      console.error(`❌ Error starting server on attempt ${attempt}:`, error);
      if (serverProcess) serverProcess.kill();
      if (attempt === 3) {
        console.error('❌ Failed to start server after 3 attempts. Aborting prerendering.');
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait before retry
    }
  }
  
  if (!serverStarted) {
    console.error('❌ Server did not start. Prerendering cannot proceed.');
    return;
  }
  
  // Give additional time for server stability
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Launch puppeteer browser
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'], timeout: 60000 });
    console.log('✅ Puppeteer launched successfully!');
  } catch (error) {
    console.error('❌ Error launching puppeteer:', error);
    if (serverProcess) serverProcess.kill();
    return;
  }
  
  const page = await browser.newPage();
  // Set a longer timeout for page operations
  page.setDefaultTimeout(60000);
  // Set user agent to avoid detection as headless
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  for (const [route, metadata] of Object.entries(routes)) {
    let retries = 0;
    let success = false;
    const maxRetries = 5;
    while (retries < maxRetries && !success) {
      try {
        console.log(`Prerendering ${route}... Attempt ${retries + 1}/${maxRetries}`);
        await page.goto(`http://localhost:5173${route}`, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'], timeout: 60000 });
        // Wait for React to fully render the content
        await page.waitForFunction('document.querySelector("#root").innerText.length > 0', { timeout: 60000 });
        // Additional wait to ensure all dynamic content loads
        await new Promise(resolve => setTimeout(resolve, 5000));
        // Get the full HTML content
        const htmlContent = await page.content();
        // Verify that content includes expected elements
        if (htmlContent.includes('<footer>') && htmlContent.includes('<header>')) {
          const filePath = path.join(outputDir, route === '/' ? 'index.html' : `${route.slice(1)}.html`);
          fs.writeFileSync(filePath, htmlContent, 'utf8');
          console.log(`✅ Prerendered ${route} to ${filePath}`);
          success = true;
        } else {
          console.error(`❌ Content validation failed for ${route}. Missing header or footer.`);
          retries++;
          await new Promise(resolve => setTimeout(resolve, 10000)); // Wait longer before retry
        }
      } catch (error) {
        console.error(`❌ Error prerendering ${route}:`, error);
        retries++;
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait before retry
      }
    }
    if (!success) {
      console.error(`❌ Failed to prerender ${route} after ${maxRetries} attempts.`);
    }
  }
  
  // Close puppeteer browser
  await browser.close();
  console.log('✅ Puppeteer browser closed.');
  
  // Stop the temporary server
  console.log('Stopping temporary Vite server...');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
    // Force kill if it doesn't terminate gracefully
    setTimeout(() => {
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill('SIGKILL');
        console.log('Forced termination of Vite server.');
      }
    }, 5000);
  }
  console.log('✅ Prerendering completed!');
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
    
    console.log('🎉 Build process completed successfully!');
  } catch (error) {
    console.error('❌ Build process failed:', error);
    process.exit(1);
  }
};

// Run the build process
main();
