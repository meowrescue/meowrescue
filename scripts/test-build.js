/**
 * Test script to verify the build process and SEO optimizations
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

console.log('🔍 Verifying build output and SEO optimizations...');

function checkSEOElements(filePath, pageName) {
  console.log(`Checking SEO for ${pageName}...`);
  try {
    const content = readFileSync(filePath, 'utf8');
    
    // Basic SEO checks
    const hasTitle = content.includes('<title>');
    const hasDescription = content.includes('<meta name="description"');
    const hasCanonical = content.includes('<link rel="canonical"');
    const hasOgTags = content.includes('<meta property="og:');
    const hasTwitterTags = content.includes('<meta property="twitter:');
    const hasStructuredData = content.includes('<script type="application/ld+json">');
    
    console.log(`✓ Title: ${hasTitle ? 'Present' : 'Missing'}`);
    console.log(`✓ Description: ${hasDescription ? 'Present' : 'Missing'}`);
    console.log(`✓ Canonical URL: ${hasCanonical ? 'Present' : 'Missing'}`);
    console.log(`✓ Open Graph Tags: ${hasOgTags ? 'Present' : 'Missing'}`);
    console.log(`✓ Twitter Cards: ${hasTwitterTags ? 'Present' : 'Missing'}`);
    console.log(`✓ Structured Data: ${hasStructuredData ? 'Present' : 'Missing'}`);
    
    // Navigation check
    const navLinksMatch = content.match(/<li><a href="[^"]*">[^<]*<\/a><\/li>/g) || [];
    console.log(`✓ Navigation Links: ${navLinksMatch.length} links found`);
    
    // Check for root div and fallback content
    const hasRootDiv = content.includes('<div id="root">');
    const hasFallbackContent = content.includes('<div class="fallback-content">');
    console.log(`✓ Root Div: ${hasRootDiv ? 'Present' : 'Missing'}`);
    console.log(`✓ Fallback Content: ${hasFallbackContent ? 'Present' : 'Missing'}`);
    
    return {
      hasAllSEO: hasTitle && hasDescription && hasCanonical && hasOgTags && hasTwitterTags,
      navLinksCount: navLinksMatch.length,
      hasStructuredData
    };
  } catch (error) {
    console.error(`Error checking SEO for ${pageName}:`, error);
    return { hasAllSEO: false, navLinksCount: 0, hasStructuredData: false };
  }
}

// Run the test
async function runTest() {
  try {
    // Check if the dist directory exists
    if (!existsSync(distDir)) {
      console.error('❌ Dist directory not found. Please run the build first.');
      return;
    }
    
    // Check for index.html
    const indexPath = join(distDir, 'index.html');
    if (!existsSync(indexPath)) {
      console.error('❌ index.html not found in dist directory.');
      return;
    }
    
    // Check for blog directory
    const blogDir = join(distDir, 'blog');
    if (!existsSync(blogDir)) {
      console.error('❌ Blog directory not found in dist directory.');
      return;
    }
    
    // Check for blog posts
    const blogPostDirs = readdirSync(blogDir).filter(name => {
      return existsSync(join(blogDir, name, 'index.html'));
    });
    
    console.log(`Found ${blogPostDirs.length} blog post directories with index.html`);
    
    // Check SEO for index page
    console.log('\n=== Home Page SEO Check ===');
    const homeSEO = checkSEOElements(indexPath, 'Home');
    
    // Check SEO for a blog post if any exist
    if (blogPostDirs.length > 0) {
      console.log('\n=== Blog Post SEO Check ===');
      const firstPostPath = join(blogDir, blogPostDirs[0], 'index.html');
      const blogPostSEO = checkSEOElements(firstPostPath, `Blog Post: ${blogPostDirs[0]}`);
      
      if (blogPostSEO.hasAllSEO && blogPostSEO.navLinksCount >= 10 && blogPostSEO.hasStructuredData) {
        console.log('\n✅ Blog post has excellent SEO optimization!');
      } else {
        console.log('\n⚠️ Blog post SEO could be improved.');
      }
    }
    
    // Check for sitemap.xml
    const sitemapPath = join(distDir, 'sitemap.xml');
    if (existsSync(sitemapPath)) {
      const sitemapContent = readFileSync(sitemapPath, 'utf8');
      const urlCount = (sitemapContent.match(/<url>/g) || []).length;
      console.log(`\n✓ Sitemap.xml found with ${urlCount} URLs`);
      
      // Check if blog posts are in sitemap
      const blogUrlsInSitemap = (sitemapContent.match(/<loc>.*?\/blog\/.*?<\/loc>/g) || []).length;
      console.log(`✓ Blog posts in sitemap: ${blogUrlsInSitemap}`);
      
      if (blogPostDirs.length > 0 && blogUrlsInSitemap === 0) {
        console.log('⚠️ Warning: Blog posts exist but none found in sitemap!');
      }
    } else {
      console.error('❌ sitemap.xml not found in dist directory.');
    }
    
    console.log('\n=== Overall Assessment ===');
    if (homeSEO.hasAllSEO && homeSEO.navLinksCount >= 10) {
      console.log('✅ Basic SEO elements are properly set up');
    } else {
      console.log('⚠️ Some SEO elements are missing');
    }
    
    if (blogPostDirs.length > 0) {
      console.log('✅ Blog posts are properly generated as static HTML');
    } else {
      console.log('⚠️ No blog posts were generated as static HTML');
    }
    
    console.log('\nDone checking SEO optimizations!');
  } catch (error) {
    console.error('Error running test:', error);
  }
}

runTest();
