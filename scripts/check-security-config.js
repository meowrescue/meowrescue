/**
 * Security Configuration Check Script
 * 
 * This script verifies that all security configurations are consistent across the application.
 * It checks CSP policies, Supabase integrations, and RLS policies.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Set up paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Define a simplified version of the CSP for checking
// This matches what's in our security.ts file
const expectedCSP = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  'img-src': [
    "'self'", 
    "data:", 
    "https://meowrescue.windsurf.build", 
    "https://sfrlnidbiviniuqhryyc.supabase.co", 
    "https://images.unsplash.com"
  ],
  'connect-src': [
    "'self'", 
    "https://sfrlnidbiviniuqhryyc.supabase.co", 
    "wss://sfrlnidbiviniuqhryyc.supabase.co"
  ]
};

// Security check results
const results = {
  csp: {
    success: true,
    issues: []
  },
  supabase: {
    success: true,
    issues: []
  },
  rls: {
    success: true,
    issues: []
  },
  files: {
    success: true,
    issues: []
  }
};

/**
 * Check Content Security Policy consistency
 */
async function checkCSPConsistency() {
  console.log('🔒 Checking CSP consistency...');
  
  // Check for conflicting CSP definitions in HTML file
  const indexHtmlPath = path.join(rootDir, 'index.html');
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  if (indexHtml.includes('Content-Security-Policy')) {
    results.csp.success = false;
    results.csp.issues.push('Found inline CSP in index.html - should use centralized config');
  }
  
  // Check for conflicting CSP in netlify.toml
  const netlifyConfigPath = path.join(rootDir, 'netlify.toml');
  const netlifyConfig = fs.readFileSync(netlifyConfigPath, 'utf8');
  
  if (netlifyConfig.includes('Content-Security-Policy =')) {
    results.csp.success = false;
    results.csp.issues.push('Found hardcoded CSP in netlify.toml - should use centralized config');
  }
  
  // Check for presence of old CSP fix scripts
  const cspFixScripts = [
    'fix-csp-all.js',
    'fix-csp-all.cjs',
    'fix-csp-headers.js',
    'fix-csp-headers.mjs'
  ];
  
  for (const script of cspFixScripts) {
    const scriptPath = path.join(rootDir, script);
    if (fs.existsSync(scriptPath)) {
      results.files.success = false;
      results.files.issues.push(`Found legacy CSP fix script: ${script} - can be removed`);
    }
  }
  
  // Check for csp-fix.js in public directory
  const publicCspFixPath = path.join(rootDir, 'public', 'csp-fix.js');
  if (fs.existsSync(publicCspFixPath)) {
    results.files.success = false;
    results.files.issues.push('Found client-side CSP fix script: public/csp-fix.js - can be removed');
  }
  
  console.log('✅ CSP checks completed');
}

/**
 * Check Supabase integration consistency
 */
async function checkSupabaseIntegration() {
  console.log('🔌 Checking Supabase integration...');
  
  // Check if we have the centralized config
  const supabaseConfigPath = path.join(rootDir, 'src', 'config', 'supabase.ts');
  if (!fs.existsSync(supabaseConfigPath)) {
    results.supabase.success = false;
    results.supabase.issues.push('Missing centralized Supabase config: src/config/supabase.ts');
  }
  
  // Check for old Supabase initialization methods
  const legacyHelperPath = path.join(rootDir, 'src', 'utils', 'supabaseHelper.ts');
  if (fs.existsSync(legacyHelperPath)) {
    results.files.success = false;
    results.files.issues.push('Found legacy Supabase helper: src/utils/supabaseHelper.ts - consider migration to centralized config');
  }
  
  const legacyFixClientPath = path.join(rootDir, 'src', 'utils', 'supabaseFixClient.ts');
  if (fs.existsSync(legacyFixClientPath)) {
    results.files.success = false;
    results.files.issues.push('Found legacy Supabase fix client: src/utils/supabaseFixClient.ts - can be removed');
  }
  
  // Check for Supabase fix scripts
  const supabaseFixScripts = [
    'fix-supabase-references.js',
    'fix-supabase-references.mjs'
  ];
  
  for (const script of supabaseFixScripts) {
    const scriptPath = path.join(rootDir, script);
    if (fs.existsSync(scriptPath)) {
      results.files.success = false;
      results.files.issues.push(`Found legacy Supabase fix script: ${script} - can be removed`);
    }
  }
  
  // Check if we can connect to Supabase
  if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.VITE_SUPABASE_ANON_KEY
      );
      
      const { data, error } = await supabase.from('cats').select('id').limit(1);
      
      if (error) {
        results.supabase.success = false;
        results.supabase.issues.push(`Supabase connection error: ${error.message}`);
      } else {
        console.log(`✅ Successfully connected to Supabase and retrieved ${data.length} cats`);
      }
    } catch (err) {
      results.supabase.success = false;
      results.supabase.issues.push(`Supabase integration error: ${err.message}`);
    }
  } else {
    console.log('⚠️ No Supabase credentials in environment, skipping connection test');
  }
  
  console.log('✅ Supabase integration checks completed');
}

/**
 * Check RLS policies
 */
async function checkRLSPolicies() {
  console.log('🔐 Checking RLS policies...');
  
  // Check if we have the centralized RLS policy file
  const rlsPolicyPath = path.join(rootDir, 'src', 'sql', 'complete_rls_setup.sql');
  if (!fs.existsSync(rlsPolicyPath)) {
    results.rls.success = false;
    results.rls.issues.push('Missing centralized RLS policy file: src/sql/complete_rls_setup.sql');
  } else {
    // Check policy file content for basic validation
    const policyContent = fs.readFileSync(rlsPolicyPath, 'utf8');
    
    // Check if the policy file has basic RLS commands
    if (!policyContent.includes('CREATE POLICY')) {
      results.rls.success = false;
      results.rls.issues.push('RLS policy file does not contain any CREATE POLICY statements');
    }
    
    if (!policyContent.includes('ENABLE ROW LEVEL SECURITY')) {
      results.rls.success = false;
      results.rls.issues.push('RLS policy file does not enable RLS on tables');
    }
    
    // Check for tables that should have RLS
    const requiredTables = ['cats', 'donations', 'expenses', 'applications'];
    for (const table of requiredTables) {
      if (!policyContent.includes(`ON public.${table}`)) {
        results.rls.success = false;
        results.rls.issues.push(`Missing RLS policy for table: ${table}`);
      }
    }
  }
  
  console.log('✅ RLS policy checks completed');
}

/**
 * Run all checks and display results
 */
async function runSecurityChecks() {
  try {
    // Run all checks
    await checkCSPConsistency();
    await checkSupabaseIntegration();
    await checkRLSPolicies();
    
    // Print results
    console.log('\n📋 Security Configuration Check Results:\n');
    
    for (const [category, result] of Object.entries(results)) {
      if (result.success) {
        console.log(`✅ ${category.toUpperCase()}: All checks passed`);
      } else {
        console.log(`❌ ${category.toUpperCase()}: Found ${result.issues.length} issues`);
        result.issues.forEach(issue => console.log(`  - ${issue}`));
      }
      console.log('');
    }
    
    // Print summary
    const totalIssues = Object.values(results).reduce((sum, result) => sum + result.issues.length, 0);
    
    if (totalIssues === 0) {
      console.log('🎉 All security checks passed! Your configuration is consistent and follows best practices.');
    } else {
      console.log(`⚠️ Found ${totalIssues} security configuration issues that need attention.`);
      console.log('📝 Review the issues above and address them to improve security.');
    }
  } catch (error) {
    console.error('❌ Error running security checks:', error);
  }
}

// Run all checks
runSecurityChecks();
