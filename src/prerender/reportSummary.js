import fs from 'fs';
import path from 'path';
import { validateHtml } from './validateHtml.js';
import { fixHtml } from './fixHtml.js';

/**
 * Reports the summary after prerendering is done.
 * Handles index.html checks and minimal asset verification.
 */
function reportSummary(staticPaths, outDir, successCount, errorCount) {
  // Print detailed completion report
  console.log('\n===== Pre-rendering Summary =====');
  console.log(`Total routes: ${staticPaths.length}`);
  console.log(`Successfully rendered: ${successCount}`);
  console.log(`Failed to render: ${errorCount}`);

  // Double check the root index.html file
  const indexPath = path.join(outDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('CRITICAL ERROR: Root index.html file is missing!');

    // Generate a fallback index.html as last resort
    try {
      const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>MeowRescue - Cat Adoption & Foster Care</title>
    <meta name="description" content="MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need." />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href="https://meowrescue.org/" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta property="og:title" content="MeowRescue - Cat Adoption & Foster Care" />
    <meta property="og:description" content="MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://meowrescue.org/" />
    <meta property="og:image" content="https://meowrescue.org/images/meow-rescue-logo.jpg" />
    <meta property="og:updated_time" content="2025-04-20T12:00:00Z" />
    <meta name="last-modified" content="2025-04-20T12:00:00Z" />
    <link rel="stylesheet" href="/assets/index.css">
    <style>
      @media (max-width: 768px) {
        body { font-size: 16px; }
        h1 { font-size: 1.8rem; }
      }
    </style>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Meow Rescue",
        "url": "https://meowrescue.org",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://meowrescue.org/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "dateModified": "2025-04-20T12:00:00Z"
      }
    </script>
  </head>
  <body>
    <div id="root">
      <h1>Meow Rescue</h1>
      <h2>Cat Adoption & Foster Care</h2>
      <p>Welcome to Meow Rescue, a home-based cat rescue in Pasco County, Florida.</p>
    </div>
    <script src="https://cdn.gpteng.co/gptengineer.min.js" type="module"></script>
    <script type="module" src="/assets/main.js"></script>
  </body>
</html>`;
      fs.writeFileSync(indexPath, fallbackHtml);
      console.log('Created fallback index.html file!');
    } catch (e) {
      console.error('Failed to create fallback index.html:', e);
    }
  } else {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const indexSize = indexContent.length;
    console.log(`Root index.html exists: ${indexSize} bytes`);

    // Verify the index.html file
    const isValidIndex = validateHtml(indexContent, indexPath);
    if (!isValidIndex) {
      console.error('CRITICAL ERROR: index.html validation failed!');
      console.error('Fixing root index.html file...');

      const fixedIndexHtml = fixHtml('/', indexContent);
      fs.writeFileSync(indexPath, fixedIndexHtml);
      console.log('Fixed root index.html file!');
    }
  }

  // Verify asset files
  const assetsDir = path.join(outDir, 'assets');
  const assetFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];
  console.log(`Found ${assetFiles.length} asset files`);

  const mainJsFile = assetFiles.find(file => file === 'main.js');
  if (!mainJsFile) {
    console.error('CRITICAL ERROR: main.js file is missing!');
  }

  const cssFiles = assetFiles.filter(file => file.endsWith('.css'));
  if (cssFiles.length === 0) {
    console.warn('⚠️ Warning: No CSS files found!');
    // Create a minimal CSS file
    fs.writeFileSync(path.join(assetsDir, 'index.css'), '/* Generated CSS */');
    console.log('Created minimal CSS file');
  }

  console.log('Pre-rendering complete!');
}

export { reportSummary };
