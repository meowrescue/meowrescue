/**
 * Script to verify SEO requirements in generated HTML files
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { validateHtml } from '../src/prerender/validateHtml.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = join(__dirname, '../dist');

function verifyHtmlFile(filePath) {
  console.log(`Verifying ${filePath}...`);
  const html = readFileSync(filePath, 'utf8');
  
  // Count all links
  const allLinks = html.match(/<a[^>]*href=[^>]*>/gi) || [];
  const internalLinks = allLinks.filter(link => {
    const href = link.match(/href=["']([^"']*)["']/i);
    return href && href[1] && !(/^(https?:|mailto:|tel:|#)/).test(href[1].trim());
  });
  
  // Count words
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(/\s+/).length;
  
  // Check for sitemap reference
  const hasSitemapRef = html.includes('sitemap.xml');
  
  // Check for required elements
  const hasNavbar = html.includes('<header') || html.includes('<nav');
  const hasFooter = html.includes('<footer');
  const hasH1 = /<h1[^>]*>.*?<\/h1>/i.test(html);
  const hasH2 = /<h2[^>]*>.*?<\/h2>/i.test(html);
  const hasCanonical = html.includes('rel="canonical"');
  const hasSchema = html.includes('application/ld+json');
  
  // Create SEO report
  const issues = [];
  if (internalLinks.length < 10) issues.push(`Too few internal links (${internalLinks.length})`);
  if (wordCount < 300) issues.push(`Too few words (${wordCount})`);
  if (!hasSitemapRef) issues.push('Missing sitemap reference');
  if (!hasNavbar) issues.push('Missing navigation/header');
  if (!hasFooter) issues.push('Missing footer');
  if (!hasH1) issues.push('Missing H1 heading');
  if (!hasH2) issues.push('Missing H2 heading');
  if (!hasCanonical) issues.push('Missing canonical link');
  if (!hasSchema) issues.push('Missing schema data');
  
  console.log(`  Internal links: ${internalLinks.length}`);
  console.log(`  Word count: ${wordCount}`);
  console.log(`  Has sitemap ref: ${hasSitemapRef ? 'Yes' : 'No'}`);
  console.log(`  Has navbar: ${hasNavbar ? 'Yes' : 'No'}`);
  console.log(`  Has footer: ${hasFooter ? 'Yes' : 'No'}`);
  console.log(`  Has H1: ${hasH1 ? 'Yes' : 'No'}`);
  console.log(`  Has H2: ${hasH2 ? 'Yes' : 'No'}`);
  
  if (issues.length > 0) {
    console.log(`❌ Issues found in ${filePath}:`);
    issues.forEach(issue => console.log(`  - ${issue}`));
    return false;
  } else {
    console.log(`✅ ${filePath} passes all SEO checks!`);
    return true;
  }
}

function verifyAllHtmlFiles(dir = DIST_DIR) {
  if (!existsSync(dir)) {
    console.error(`❌ Directory ${dir} does not exist!`);
    return;
  }
  
  console.log(`Verifying all HTML files in ${dir}...`);
  
  const files = readdirSync(dir);
  let htmlFiles = [];
  
  // Process all files and directories
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively verify HTML files in subdirectories
      htmlFiles = [...htmlFiles, ...verifyAllHtmlFiles(filePath)];
    } else if (file.endsWith('.html')) {
      htmlFiles.push(filePath);
      verifyHtmlFile(filePath);
    }
  });
  
  return htmlFiles;
}

// Verify sitemap.xml exists
function verifySitemap() {
  const sitemapPath = join(DIST_DIR, 'sitemap.xml');
  if (existsSync(sitemapPath)) {
    console.log(`✅ sitemap.xml exists!`);
    const content = readFileSync(sitemapPath, 'utf8');
    const urlCount = (content.match(/<url>/g) || []).length;
    console.log(`  sitemap.xml contains ${urlCount} URLs`);
    return true;
  } else {
    console.error(`❌ sitemap.xml does not exist!`);
    return false;
  }
}

// Verify robots.txt exists and contains sitemap reference
function verifyRobotsTxt() {
  const robotsPath = join(DIST_DIR, 'robots.txt');
  if (existsSync(robotsPath)) {
    console.log(`✅ robots.txt exists!`);
    const content = readFileSync(robotsPath, 'utf8');
    if (content.includes('Sitemap:')) {
      console.log(`  robots.txt contains sitemap reference`);
      return true;
    } else {
      console.error(`❌ robots.txt does not contain sitemap reference!`);
      return false;
    }
  } else {
    console.error(`❌ robots.txt does not exist!`);
    return false;
  }
}

// Run the verification
console.log('Starting SEO verification...');
verifySitemap();
verifyRobotsTxt();
const htmlFiles = verifyAllHtmlFiles();
console.log(`Verified ${htmlFiles.length} HTML files.`);
console.log('SEO verification complete!');
