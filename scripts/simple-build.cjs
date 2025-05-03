console.log('\n--- Script Start ---');

// Simple build script for Meow Rescue SSG
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load environment variables (Supabase keys needed later)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

// Helper function for timestamp logging
const log = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${message}`);
};

// Function to clean previous build
const cleanPreviousBuild = () => {
  log('🧹 Cleaning previous build...');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(path.join(distDir, 'client'), { recursive: true });
  fs.mkdirSync(path.join(distDir, 'server'), { recursive: true });
  log('✅ Clean completed');
};

// Function to build client and server entries
async function buildClientAndServer() {
  log('📦 Building client application...');
  try {
    log('--> Entering try block for client/server build.');
    
    // Use Vite's programmatic API with a simplified configuration
    log('--> About to build client with programmatic API...');
    
    // Require Vite just before using it to ensure it's fresh
    const { build } = require('vite');
    
    try {
      await build({
        root: rootDir,
        mode: 'production',
        build: {
          outDir: 'dist/client',
          emptyOutDir: true,
          minify: false, // Disable minification for testing
          sourcemap: false, // Disable sourcemaps for testing
          // Simplified rollup options
          rollupOptions: {
            input: path.resolve(rootDir, 'index.html'),
            output: {
              manualChunks: undefined, // Disable code splitting for testing
            }
          }
        },
        logLevel: 'info',
      });
      log('--> Client build completed successfully.');
    } catch (buildError) {
      log(`❌ Error during Vite build: ${buildError.message}`);
      console.error(buildError);
      process.exit(1);
    }

    log('📦 Building server entry...');
    log('--> Server build is commented out for now.');
    /* Server build is still commented out
    await build({
      root: rootDir,
      mode: 'production',
      build: {
        ssr: 'src/entry-server.tsx',
        outDir: 'dist/server',
        rollupOptions: {
          input: 'src/entry-server.tsx',
        },
      },
      logLevel: 'info',
    });
    */

    log('✅ Client build completed.');
    return true; 
  } catch (error) {
    log('❌ Detailed Error during build process:');
    console.error(error);
    process.exit(1);
  }
}

// Dynamic Route Fetching Functions
async function getCatPaths() {
  // Initialize Supabase here
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase creds missing for getCatPaths');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase.from('cats').select('id');
  if (error) {
    console.error('Error fetching cat paths:', error);
    return [];
  }
  return data.map(cat => `/cats/${cat.id}`);
}

async function getBlogPostPaths() {
  // Initialize Supabase here
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase creds missing for getBlogPostPaths');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase.from('blog_posts').select('slug').eq('is_published', true);
  if (error) {
    console.error('Error fetching blog post paths:', error);
    return [];
  }
  return data.map(post => `/blog/${post.slug}`);
}

async function getEventPaths() {
  // Initialize Supabase here
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase creds missing for getEventPaths');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Assuming events have numeric IDs
  const { data, error } = await supabase.from('events').select('id'); 
  if (error) {
    console.error('Error fetching event paths:', error);
    return [];
  }
  return data.map(event => `/events/${event.id}`);
}

// Function to render all routes to static HTML
async function renderRoutesToHtml() {
  log('📄 Rendering routes to static HTML...');

  // Dynamically import the built server entry
  const serverEntryPath = path.join(distDir, 'server', 'entry-server.js');
  const { render } = await import(`file://${serverEntryPath}`);
  const { QueryClient, dehydrate } = await import('@tanstack/react-query');

  // Load the base HTML template
  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

  // Define static routes
  const staticRoutes = [
    '/', '/about', '/cats', '/adopt', '/adopt/apply', '/volunteer', '/volunteer/apply',
    '/foster', '/foster/apply', '/donate', '/events', '/blog', '/contact',
    '/lost-found', '/lost-found/apply', '/success-stories', '/faq', '/privacy-policy', '/terms-of-service',
    '/financial-transparency'
    // Add any other static routes here
  ];

  // Fetch dynamic route paths
  log('📡 Fetching dynamic route paths from Supabase...');
  const catPaths = await getCatPaths();
  const blogPaths = await getBlogPostPaths();
  const eventPaths = await getEventPaths();
  // Add other dynamic path fetches here (e.g., lost-found items)
  const allRoutes = [...staticRoutes, ...catPaths, ...blogPaths, ...eventPaths];
  log(`🔍 Discovered ${allRoutes.length} total routes (${staticRoutes.length} static, ${allRoutes.length - staticRoutes.length} dynamic).`);

  // Create rendering tasks for all routes
  const renderTasks = allRoutes.map(async (url) => {
    try {
      const start = performance.now();
      log(`  Rendering: ${url}`);

      // Create a new QueryClient for each page render
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            // Set staleTime and gcTime to Infinity to prevent refetching on the client
            // for initially pre-fetched data during SSG.
            staleTime: Infinity,
            gcTime: Infinity,
          }
        }
      });
      let pageData = null; // For data not suitable for React Query cache

      // --- Data Prefetching Logic ---
      if (url.startsWith('/cats/')) {
        const catId = url.split('/').pop();
        if (catId) {
          log(`    Prefetching data for cat ID: ${catId}`);
          // Fetch detailed cat data
          const { createClient } = require('@supabase/supabase-js');
          const supabaseUrl = process.env.VITE_SUPABASE_URL;
          const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
          if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase creds missing for cat detail');
          const supabase = createClient(supabaseUrl, supabaseAnonKey);

          const { data: cat, error: catError } = await supabase
            .from('cats')
            .select('*') // Select all necessary fields
            .eq('id', catId)
            .single();

          if (catError) throw new Error(`Failed to fetch cat ${catId}: ${catError.message}`);
          if (!cat) throw new Error(`Cat with ID ${catId} not found.`);

          // Fetch related data (e.g., medical records)
          const { data: medicalRecords, error: medError } = await supabase
            .from('cat_medical_records')
            .select('*')
            .eq('cat_id', catId)
            .order('record_date', { ascending: false });

          if (medError) console.warn(`    Warn: Failed to fetch medical records for cat ${catId}: ${medError.message}`);

          // Prefetch the data into React Query
          const catDetailQueryKey = ['catDetail', catId];
          await queryClient.prefetchQuery({
            queryKey: catDetailQueryKey,
            queryFn: () => ({ ...cat, medicalRecords: medicalRecords || [] }),
          });
          // Pass data to PageDataProvider if needed
          pageData = { pageType: 'catDetail', catId }; 
        }
      } else if (url.startsWith('/blog/')) {
        const slug = url.split('/').pop();
        if (slug) {
          log(`    Prefetching data for blog slug: ${slug}`);
          const { createClient } = require('@supabase/supabase-js');
          const supabaseUrl = process.env.VITE_SUPABASE_URL;
          const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
          if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase creds missing for blog post');
          const supabase = createClient(supabaseUrl, supabaseAnonKey);

          const { data: post, error: postError } = await supabase
            .from('blog_posts')
            .select('*') // Select necessary fields
            .eq('slug', slug)
            .eq('is_published', true)
            .single();

          if (postError) throw new Error(`Failed to fetch blog post ${slug}: ${postError.message}`);
          if (!post) throw new Error(`Blog post with slug ${slug} not found or not published.`);

           // Fetch related posts (example)
           const { data: relatedPosts, error: relatedError } = await supabase
             .from('blog_posts')
             .select('id, title, slug, published_at, featured_image_url')
             .neq('id', post.id)
             .eq('is_published', true)
             // Add logic for related tags/categories if needed
             .limit(3);

           if (relatedError) console.warn(`    Warn: Failed to fetch related posts for ${slug}: ${relatedError.message}`);

          // Prefetch into React Query
          const blogPostQueryKey = ['blogPost', slug];
          await queryClient.prefetchQuery({
            queryKey: blogPostQueryKey,
            queryFn: () => ({ ...post, relatedPosts: relatedPosts || [] }),
          });
          pageData = { pageType: 'blogPost', slug };
        }
      } else if (url.startsWith('/events/')) {
        const eventId = url.split('/').pop();
        if (eventId && !isNaN(Number(eventId))) { // Ensure it's a valid ID
          log(`    Prefetching data for event ID: ${eventId}`);
          const { createClient } = require('@supabase/supabase-js');
          const supabaseUrl = process.env.VITE_SUPABASE_URL;
          const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
          if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase creds missing for event detail');
          const supabase = createClient(supabaseUrl, supabaseAnonKey);

          const { data: event, error: eventError } = await supabase
            .from('events')
            .select('*') // Select necessary fields
            .eq('id', eventId)
            .single();

          if (eventError) throw new Error(`Failed to fetch event ${eventId}: ${eventError.message}`);
          if (!event) throw new Error(`Event with ID ${eventId} not found.`);

          // Prefetch into React Query
          const eventDetailQueryKey = ['eventDetail', eventId];
          await queryClient.prefetchQuery({
            queryKey: eventDetailQueryKey,
            queryFn: () => event,
          });
           pageData = { pageType: 'eventDetail', eventId };
        }
      }
      // Add more prefetching logic for other page types (e.g., list pages)
      else if (url === '/cats') {
        log(`    Prefetching data for /cats list`);
        const catsListQueryKey = ['adoptable-cats'];
        await queryClient.prefetchQuery({
          queryKey: catsListQueryKey,
          queryFn: async () => {
            const { createClient } = require('@supabase/supabase-js');
            const supabaseUrl = process.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
            if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase creds missing for cats list');
            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            const { data, error } = await supabase.from('cats').select('*').eq('status', 'Available').order('name');
            if (error) throw error;
            return data;
          },
        });
      } else if (url === '/blog') {
        log(`    Prefetching data for /blog list`);
        const blogListQueryKey = ['blogPosts']; // Ensure this key matches your component's useQuery
        await queryClient.prefetchQuery({
          queryKey: blogListQueryKey,
          queryFn: async () => {
            const { createClient } = require('@supabase/supabase-js');
            const supabaseUrl = process.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
            if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase creds missing for blog list');
            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            const { data, error } = await supabase.from('blog_posts').select('*').eq('is_published', true).order('published_at', { ascending: false });
            if (error) throw error;
            return data;
          },
        });
      } else if (url === '/events') {
         log(`    Prefetching data for /events list`);
         const eventsListQueryKey = ['events']; // Ensure this key matches your component's useQuery
         await queryClient.prefetchQuery({
           queryKey: eventsListQueryKey,
           queryFn: async () => {
             const { createClient } = require('@supabase/supabase-js');
             const supabaseUrl = process.env.VITE_SUPABASE_URL;
             const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
             if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase creds missing for events list');
             const supabase = createClient(supabaseUrl, supabaseAnonKey);

             const { data, error } = await supabase.from('events').select('*').order('date_start', { ascending: true });
             if (error) throw error;
             return data;
           },
         });
      }
      // --- End Data Prefetching ---

      // 2. Render the route using the server entry
      log(`    Calling server render function for ${url}...`);
      const context = {}; // Placeholder for context if needed by render function
      const { appHtml, helmetContext, dehydratedState } = await render(url, queryClient, null, context);
      const { helmet } = helmetContext;

      // Inject into template
      // Important: Make sure placeholders exist in your dist/index.html
      // Example: <title>Placeholder Title</title>, <!--app-html-->, maybe <!--helmet-tags-->
      let html = template;
      // 1. Inject Helmet Tags (handle potential lack of placeholder)
      const helmetHtml = `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.script.toString()}${helmet.style.toString()}`;
      if (html.includes('<!--helmet-tags-->')) {
        html = html.replace('<!--helmet-tags-->', helmetHtml);
      } else {
        // Fallback: inject before closing </head>
        html = html.replace('</head>', `${helmetHtml}\n</head>`);
      }

      // 2. Inject App HTML
      html = html.replace('<!--app-html-->', appHtml);

      // 3. Inject Initial Data Script
      const initialStateScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify({ queryClient: dehydratedState, pageData }).replace(/</g, '\\u003c')}; window.__INITIAL_PATH__ = "${url}";</script>`;
      html = html.replace('</body>', `${initialStateScript}\n</body>`);

      // Determine file path (use clean URLs: /about -> /about/index.html)
      const filePath = path.join(distDir, url === '/' ? 'index.html' : path.join(url.substring(1), 'index.html'));
      const fileDir = path.dirname(filePath);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      fs.writeFileSync(filePath, html);
      const duration = (performance.now() - start).toFixed(2);
      log(`    ✅ Successfully rendered ${url} in ${duration}ms`, 'success');

      // Reset query client state for the next route (important!)
      queryClient.clear();

    } catch (e) {
      console.error(`❌ Failed to render ${url}: ${e.message}`);
      // Optionally, decide if one error should stop the whole build
      // process.exit(1);
    }
  });

  // Wait for all rendering tasks to complete
  await Promise.all(renderTasks);
  log('✅ Static HTML files generated!');
  return allRoutes; // Return all generated routes for sitemap
}

// Function to get all dynamic routes for sitemap generation
async function getAllDynamicRoutes() {
  log('🔍 Fetching dynamic routes...');
  
  // Initialize Supabase client for fetching dynamic routes
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    log('⚠️ Missing Supabase credentials. Skipping dynamic routes.');
    return {
      blogPosts: [],
      cats: [],
      events: []
    };
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Fetch blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true);
      
    if (blogError) {
      log(`⚠️ Error fetching blog posts: ${blogError.message}`);
      return { blogPosts: [], cats: [], events: [] };
    }
    
    // Fetch cats
    const { data: cats, error: catsError } = await supabase
      .from('cats')
      .select('id');
      
    if (catsError) {
      log(`⚠️ Error fetching cats: ${catsError.message}`);
      return { blogPosts, cats: [], events: [] };
    }
    
    // Fetch events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id');
      
    if (eventsError) {
      log(`⚠️ Error fetching events: ${eventsError.message}`);
      return { blogPosts, cats, events: [] };
    }
    
    log(`✅ Found ${blogPosts.length} blog posts, ${cats.length} cats, and ${events.length} events.`);
    return { blogPosts, cats, events };
  } catch (error) {
    log(`⚠️ Error fetching dynamic routes: ${error.message}`);
    return { blogPosts: [], cats: [], events: [] };
  }
}

// Generate a sitemap.xml file
async function generateSitemap(dynamicRoutes) {
  log('🗺️ Generating sitemap...');
  
  const baseUrl = 'https://meowrescue.org';
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Routes -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/cats</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/events</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/donate</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`;
  
  // Add dynamic blog post routes
  if (dynamicRoutes.blogPosts && dynamicRoutes.blogPosts.length > 0) {
    dynamicRoutes.blogPosts.forEach(post => {
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  }
  
  // Add dynamic cat routes
  if (dynamicRoutes.cats && dynamicRoutes.cats.length > 0) {
    dynamicRoutes.cats.forEach(cat => {
      sitemap += `
  <url>
    <loc>${baseUrl}/cats/${cat.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
  }
  
  // Add dynamic event routes
  if (dynamicRoutes.events && dynamicRoutes.events.length > 0) {
    dynamicRoutes.events.forEach(event => {
      sitemap += `
  <url>
    <loc>${baseUrl}/events/${event.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  }
  
  // Close the sitemap
  sitemap += `
</urlset>`;
  
  // Write the sitemap to disk
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  log('✅ Sitemap generated successfully.');
}

// Function to generate robots.txt
const generateRobotsTxt = () => {
  log('📝 Generating robots.txt...');
  const robotsContent = `# Meow Rescue Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: https://meowrescue.org/sitemap.xml
`;
  const outputDir = path.join(process.cwd(), 'dist');
  fs.writeFileSync(path.join(outputDir, 'robots.txt'), robotsContent, 'utf8');
  log('✅ Robots.txt generated!');
};

// Function to create _redirects file for Netlify
const createRedirects = () => {
  log('🚦 Creating _redirects file...');
  const redirectsContent = `
# Netlify Redirects

# SPA fallback for client-side routing if needed (e.g., for admin panel?)
# If your entire site is SSG, you might not need this.
# /admin/*  /admin/index.html  200

# Handle potential trailing slashes (optional but good practice)
# If saving as /about/index.html, Netlify handles this automatically.
# If saving as /about.html, you might need rules like:
# /about/   /about.html   301

# Catch-all for 404 page (ensure you have a 404.html)
/*    /404.html   404
`;
  fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent.trim(), 'utf8');
  log('✅ _redirects file created!');
};

// Main function
async function main() {
  log('🚀 Starting SSG build process...');
  
  // Clean the dist directory
  cleanPreviousBuild();
  
  // Build the client and server applications
  const buildSuccess = await buildClientAndServer();
  
  // Only proceed with dynamic routes and sitemap if build was successful
  if (buildSuccess) {
    log('📄 Fetching dynamic routes for sitemap...');
    const dynamicRoutes = await getAllDynamicRoutes();
    
    log('🗺️ Generating sitemap...');
    await generateSitemap(dynamicRoutes);
    
    log('📝 Generating robots.txt...');
    await generateRobotsTxt();
    
    log('🚦 Creating _redirects file...');
    await createRedirects();
    
    log('✅ Build process completed successfully!');
    return true;
  } else {
    log('❌ Build process failed. Skipping dynamic routes and sitemap generation.');
    return false;
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error in main process:', error);
  process.exit(1);
});
