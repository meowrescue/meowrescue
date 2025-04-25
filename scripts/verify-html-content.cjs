// Script to verify the content of generated HTML files
const fs = require('fs');
const path = require('path');

const outputDir = path.join(process.cwd(), 'dist');
const routes = [
  '/',
  '/about',
  '/adopt',
  '/cats',
  '/blog',
  '/events',
  '/foster',
  '/lost-found',
  '/resources',
  '/success-stories',
  '/volunteer',
  '/donate',
  '/financial-transparency'
];

console.log('🔍 Verifying HTML content of generated files...');
routes.forEach(route => {
  const filePath = route === '/' ? path.join(outputDir, 'index.html') : path.join(outputDir, `${route.slice(1)}.html`);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`📄 Checking ${route}:`);
    console.log(`  - File: ${filePath}`);
    console.log(`  - Content Length: ${content.length}`);
    console.log(`  - Contains <!DOCTYPE html>: ${content.includes('<!DOCTYPE html>')}`);
    console.log(`  - Contains <head>: ${content.includes('<head>')}`);
    console.log(`  - Contains <body>: ${content.includes('<body>')}`);
    console.log(`  - Contains #root: ${content.includes('#root')}`);
  } else {
    console.error(`❌ File not found for route ${route}: ${filePath}`);
  }
});
console.log('✅ Verification complete.');
