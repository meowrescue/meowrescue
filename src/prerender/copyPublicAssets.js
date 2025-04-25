// Move the copyPublicAssets logic here
import { existsSync, readdirSync, statSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function copyPublicAssets() {
  const publicDir = join(__dirname, '../../public');
  const distDir = join(__dirname, '../../dist');
  
  if (existsSync(publicDir)) {
    const files = readdirSync(publicDir);

    files.forEach(file => {
      const srcPath = join(publicDir, file);
      const destPath = join(distDir, file);
      
      // Skip if it's a directory or if the file already exists in dist
      if (statSync(srcPath).isDirectory() || existsSync(destPath)) {
        return;
      }
      
      copyFileSync(srcPath, destPath);
      console.log(`Copied public asset: ${file}`);
    });
  }
}
