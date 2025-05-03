import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Execute the build with a simplified approach
 */
async function buildWithSSG() {
  try {
    console.log('Starting build process...');
    
    // Run the simple build script which handles everything
    console.log('Running simple build process...');
    await execAsync('node scripts/simple-build.cjs', { stdio: 'inherit' });
    
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Error during build:', error);
    if (error.stderr) console.error('Error details:', error.stderr);
    process.exit(1);
  }
}

buildWithSSG();
