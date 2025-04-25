// Enhanced validateHtml function that checks for complete content
function validateHtml(html, outputPath) {
  const criticalElements = [
    { name: 'DOCTYPE', regex: /<!DOCTYPE html>/i },
    { name: 'html tag', regex: /<html[^>]*>/i },
    { name: 'head tag', regex: /<head[^>]*>/i },
    { name: 'body tag', regex: /<body[^>]*>/i },
    { name: 'root div', regex: /<div id="root">/i },
    { name: 'script tags', regex: /<script/i },
    { name: 'main.js script', regex: /src="\/assets\/main\.js"/i },
    { name: 'preloaded state', regex: /window\.__PRELOADED_STATE__/i },
    { name: 'css link', regex: /<link [^>]*stylesheet[^>]*>/i },
    { name: 'schema data', regex: /<script type="application\/ld\+json">/i },
    { name: 'meta description', regex: /<meta name="description"/i },
    { name: 'canonical link', regex: /<link rel="canonical"/i },
    { name: 'content freshness', regex: /(og:updated_time|last-modified)/i },
    { name: 'mobile media query', regex: /@media\s*\(\s*max-width/i },
    { name: 'sitemap link', regex: /<link rel="sitemap" type="application\/xml" href="\/sitemap\.xml"/i },
    
    // Additional critical elements for complete rendering
    { name: 'header element', regex: /<header[^>]*>/i },
    { name: 'footer element', regex: /<footer[^>]*>/i },
    { name: 'navigation', regex: /<nav[^>]*>/i },
    { name: 'logo or brand', regex: /Meow\s*Rescue/i },
    { name: 'GPT Engineer script', regex: /src="https:\/\/cdn\.gpteng\.co\/gptengineer.*\.js"/i },
  ];

  const issues = criticalElements.filter(element => !element.regex.test(html));
  
  // Check specifically for H1 tag
  const hasH1 = /<h1[^>]*>.*?<\/h1>/i.test(html);
  if (!hasH1) {
    issues.push({ name: 'H1 heading' });
  }
  
  // Check specifically for H2 tag
  const hasH2 = /<h2[^>]*>.*?<\/h2>/i.test(html);
  if (!hasH2) {
    issues.push({ name: 'H2 heading' });
  }
  
  // Improved check for navigation links (more thorough check)
  const navSections = html.match(/<nav[^>]*>[\s\S]*?<\/nav>/gi) || [];
  const hasNavLinks = navSections.some(section => /<a[^>]*>[\s\S]*?<\/a>/i.test(section));
  if (!hasNavLinks) {
    issues.push({ name: 'Navigation links' });
  }
  
  // Improved check for footer content (more thorough)
  const footerSections = html.match(/<footer[^>]*>[\s\S]*?<\/footer>/gi) || [];
  const hasFooterContent = footerSections.some(section => /<a[^>]*>[\s\S]*?<\/a>/i.test(section));
  if (!hasFooterContent) {
    issues.push({ name: 'Footer links' });
  }
  
  // Count all links for SEO - improved approach to find EVERY link
  const allLinks = (html.match(/<a[^>]*href=[^>]*>/gi) || []).filter(link => !link.includes('aria-hidden="true"'));
  const allHrefs = [];

  // More detailed link extraction
  allLinks.forEach(link => {
    const hrefMatch = link.match(/href=["']([^"']*)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      allHrefs.push(hrefMatch[1]);
    }
  });
  
  // Categorize links as internal or external (improved logic)
  const internalLinks = allHrefs.filter(href => 
    !href.startsWith('http') && 
    !href.startsWith('mailto:') && 
    !href.startsWith('tel:') && 
    href !== '#'
  );
  
  const externalLinks = allHrefs.filter(href => 
    href.startsWith('http') || 
    href.startsWith('https') ||
    href.startsWith('mailto:') || 
    href.startsWith('tel:')
  );
  
  console.log(`Found total of ${allLinks.length} links (${internalLinks.length} internal, ${externalLinks.length} external) in ${outputPath}`);
  
  if (internalLinks.length < 10) {
    console.warn(`⚠️ Warning: Only ${internalLinks.length} internal links found in ${outputPath}. SEO requires more internal links.`);
    issues.push({ name: 'Sufficient internal links (needs 10+)' });
  }
  
  // Check for total words in content
  const bodyContent = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let textContent = '';
  if (bodyContent && bodyContent[1]) {
    // Extract text content from HTML (strip tags)
    textContent = bodyContent[1].replace(/<[^>]*>/g, ' ');
    // Remove extra whitespace and normalize
    textContent = textContent.replace(/\s+/g, ' ').trim();
  }
  
  const wordCount = textContent.split(/\s+/).length;
  console.log(`Found ${wordCount} words in ${outputPath}`);
  
  // Extra check for word count sufficiency
  if (wordCount < 300) {
    console.warn(`⚠️ Warning: Only ${wordCount} words found in ${outputPath} - content may be incomplete for SEO`);
    issues.push({ name: 'Sufficient word count (needs 300+ words)' });
  }
  
  // Ensure sitemap reference exists
  const hasSitemapLink = html.includes('href="/sitemap.xml"') || html.includes('href="sitemap.xml"');
  const hasSitemapMeta = html.includes('<link rel="sitemap"');
  
  if (!hasSitemapLink && !hasSitemapMeta) {
    issues.push({ name: 'Sitemap XML reference' });
    console.error('Missing sitemap.xml link in HTML');
  }
  
  if (issues.length > 0) {
    console.error(`HTML validation issues in ${outputPath}:`);
    issues.forEach(issue => console.error(`- Missing ${issue.name}`));
    return false;
  }
  
  return true;
}

export { validateHtml };
