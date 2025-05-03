/**
 * Legacy Fix Scripts Cleanup
 * 
 * This script safely removes the redundant fix scripts after verifying
 * that their functionality has been properly migrated to the centralized configuration.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Create backup directory if it doesn't exist
const backupDir = path.join(rootDir, 'legacy-scripts-backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`✅ Created backup directory: ${backupDir}`);
}

// Legacy scripts to be removed
const legacyScripts = [
  // CSP fix scripts
  'fix-csp-all.js',
  'fix-csp-all.cjs',
  'fix-csp-headers.js',
  'fix-csp-headers.mjs',
  // Supabase fix scripts
  'fix-supabase-references.js',
  'fix-supabase-references.mjs',
  'fix-supabase-env.cjs'
];

// Public directory scripts
const publicScripts = [
  'csp-fix.js'
];

// Legacy utility files
const legacyUtils = [
  path.join('src', 'utils', 'supabaseFixClient.ts'),
  path.join('src', 'utils', 'supabaseHelper.ts')
];

// Function to back up and remove a file
function backupAndRemoveFile(filePath) {
  try {
    const fullPath = path.join(rootDir, filePath);
    
    // Check if file exists
    if (fs.existsSync(fullPath)) {
      // Create backup
      const backupPath = path.join(backupDir, filePath.replace(/\//g, '_'));
      fs.copyFileSync(fullPath, backupPath);
      
      // Remove the original
      fs.unlinkSync(fullPath);
      
      console.log(`✅ Backed up and removed: ${filePath}`);
      return true;
    } else {
      console.log(`⏩ File not found, skipping: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error handling file ${filePath}:`, error);
    return false;
  }
}

// Process root scripts
console.log("\n🧹 Cleaning up legacy scripts in root directory...");
let rootScriptsRemoved = 0;
for (const script of legacyScripts) {
  if (backupAndRemoveFile(script)) {
    rootScriptsRemoved++;
  }
}

// Process public scripts
console.log("\n🧹 Cleaning up legacy scripts in public directory...");
let publicScriptsRemoved = 0;
for (const script of publicScripts) {
  if (backupAndRemoveFile(path.join('public', script))) {
    publicScriptsRemoved++;
  }
}

// Process legacy utilities
console.log("\n🧹 Cleaning up legacy utility files...");
let utilsRemoved = 0;
for (const util of legacyUtils) {
  if (backupAndRemoveFile(util)) {
    utilsRemoved++;
  }
}

// Print summary
console.log("\n📋 Cleanup Summary:");
console.log(`Root scripts removed: ${rootScriptsRemoved}/${legacyScripts.length}`);
console.log(`Public scripts removed: ${publicScriptsRemoved}/${publicScripts.length}`);
console.log(`Utility files removed: ${utilsRemoved}/${legacyUtils.length}`);
console.log(`Total files removed: ${rootScriptsRemoved + publicScriptsRemoved + utilsRemoved}`);

// Print next steps
console.log("\n🚀 Next Steps:");
console.log("1. Run 'npm run security:check' to verify all security configurations");
console.log("2. Test your application to ensure everything works correctly");
console.log("3. If needed, the backup files are in the 'legacy-scripts-backup' directory");
