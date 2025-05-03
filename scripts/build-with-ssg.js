
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Execute the build with SSG rendering
 */
async function buildWithSSG() {
  try {
    console.log('Running pre-render to generate static HTML...');
    
    // Run the prerender script
    await execAsync('node src/prerender.js', { stdio: 'inherit' });
    
    console.log('Pre-rendering complete.');
    
    // Copy robots.txt and sitemap.xml to the root directory
    await execAsync('cp dist/robots.txt ./ || true');
    await execAsync('cp dist/sitemap.xml ./ || true');
    
    console.log('Build with SSG completed successfully');
  } catch (error) {
    console.error('Error during SSG build:', error);
    process.exit(1);
  }
}

buildWithSSG();
