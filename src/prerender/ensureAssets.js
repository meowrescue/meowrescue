import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Ensures essential assets (assets directory, index.css) exist.
 */
export function ensureAssets(outDir) {
  const assetsDir = join(outDir, 'assets');
  if (!existsSync(assetsDir)) {
    mkdirSync(assetsDir, { recursive: true });
    console.warn('⚠️ No assets directory found. Created new assets dir.');
  }
  const cssFile = join(assetsDir, 'index.css');
  if (!existsSync(cssFile)) {
    writeFileSync(cssFile, '/* Placeholder CSS */');
    console.warn('⚠️ No index.css found. Created minimal placeholder CSS.');
  }
}
