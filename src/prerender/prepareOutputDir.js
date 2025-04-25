import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Ensures the output directory exists and logs the action.
 * Returns the absolute output directory path.
 */
export function prepareOutputDir() {
  const outDir = join(__dirname, '../../dist');
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
    console.log(`Created output directory: ${outDir}`);
  }
  console.log(`Output directory: ${outDir}`);
  return outDir;
}
