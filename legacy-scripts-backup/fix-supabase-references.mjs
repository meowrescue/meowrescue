// This script will scan the codebase for direct supabase references and suggest fixes
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const srcDir = path.resolve(__dirname, 'src');
const ignoreDirs = [
  'node_modules',
  'dist',
  '.git',
  'public',
  'assets',
  'services/finance', // Already checked/fixed manually
  'utils/supabaseHelper.ts' // Contains our fix
];

// Regular expressions for finding issues
const directSupabaseAccess = /\bawait\s+supabase\b(?!.*=\s*getSupabaseClient\(\))/g;
const directSupabaseUsage = /\bsupabase\.(?!.*=\s*getSupabaseClient\(\))/g;
const missingImport = /(?<!\bimport\s+.*?)getSupabaseClient(?!.*from\s+['"]@\/integrations\/supabase\/client['"])/g;

// Track statistics
let stats = {
  filesScanned: 0,
  filesWithIssues: 0,
  issuesFixed: 0,
  issuesFoundButNotFixed: 0
};

// Helper function to check if file should be ignored
function shouldIgnoreFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return true;
  }
  
  return ignoreDirs.some(dir => filePath.includes(dir));
}

// Find all TypeScript files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip ignored directories
      if (!ignoreDirs.some(ignoreDir => file === ignoreDir)) {
        findTsFiles(filePath, fileList);
      }
    } else if ((filePath.endsWith('.ts') || filePath.endsWith('.tsx')) && !shouldIgnoreFile(filePath)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Check a file for direct supabase usage without getSupabaseClient
function checkFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let hasImportedGetSupabaseClient = content.includes("import getSupabaseClient from '@/integrations/supabase/client'");
  let hasIssues = false;
  
  // Check for direct supabase usage
  const hasDirectUsage = directSupabaseAccess.test(content) || directSupabaseUsage.test(content);
  
  // Reset regex lastIndex
  directSupabaseAccess.lastIndex = 0;
  directSupabaseUsage.lastIndex = 0;
  
  // Fix #1: Add import if using getSupabaseClient but missing import
  if (content.includes('getSupabaseClient') && !hasImportedGetSupabaseClient) {
    hasIssues = true;
    content = "import getSupabaseClient from '@/integrations/supabase/client';\n" + content;
    console.log(`\x1b[33m[IMPORT ADDED]\x1b[0m ${filePath}: Added missing import for getSupabaseClient`);
  }
  
  // Fix #2: Replace direct supabase usage with getSupabaseClient()
  if (hasDirectUsage) {
    hasIssues = true;
    
    // Add import if needed
    if (!hasImportedGetSupabaseClient && !content.includes("import getSupabaseClient from '@/integrations/supabase/client'")) {
      content = "import getSupabaseClient from '@/integrations/supabase/client';\n" + content;
      console.log(`\x1b[33m[IMPORT ADDED]\x1b[0m ${filePath}: Added import for getSupabaseClient`);
    }
    
    // Replace direct supabase access with getSupabaseClient()
    let fixedContent = content.replace(/await\s+supabase\./g, 'await getSupabaseClient().');
    fixedContent = fixedContent.replace(/(?<!\bawait\s+)supabase\./g, 'getSupabaseClient().');
    
    if (fixedContent !== content) {
      content = fixedContent;
      console.log(`\x1b[32m[FIXED]\x1b[0m ${filePath}: Replaced direct supabase access with getSupabaseClient()`);
      stats.issuesFixed++;
    } else {
      console.log(`\x1b[31m[NOT FIXED]\x1b[0m ${filePath}: Found direct supabase usage but couldn't fix automatically`);
      stats.issuesFoundButNotFixed++;
    }
  }
  
  // Write changes back to file if modified
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return hasIssues;
}

// Main execution
console.log('🔍 Scanning for direct supabase references...');
const files = findTsFiles(srcDir);
console.log(`Found ${files.length} TypeScript files to scan`);

files.forEach(file => {
  stats.filesScanned++;
  const hasIssues = checkFile(file);
  if (hasIssues) {
    stats.filesWithIssues++;
  }
});

// Print summary
console.log('\n📊 Scan Complete! Summary:');
console.log(`- Files scanned: ${stats.filesScanned}`);
console.log(`- Files with issues: ${stats.filesWithIssues}`);
console.log(`- Issues fixed: ${stats.issuesFixed}`);
console.log(`- Issues found but not fixed: ${stats.issuesFoundButNotFixed}`);

console.log('\n✅ Done! Remember to test your application after these changes.');
console.log('   You might need to manually check files that couldn\'t be fixed automatically.');
