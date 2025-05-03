/**
 * Enhanced prerendering script to generate HTML files including dynamic blog posts
 * This ensures all content is available as static HTML for SEO
 */
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables for local development
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client with environment variables from Netlify
// These variables should ONLY be accessed during build time on Netlify servers
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client only if credentials are available
let supabase = null;
if (supabaseUrl && supabaseKey) {
  // This is only used during build time and server-side rendering
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized for pre-rendering (server-side only)');
} else {
  console.warn('Supabase credentials not available. Some prerendering features will be limited.');
  console.warn('Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Netlify build environment');
}

// Domain for SEO
const SEO_DOMAIN = 'https://meowrescue.org';

// Basic routes to generate HTML files for
const routes = [
  '/',
  '/about',
  '/cats',
  '/adopt',
  '/volunteer',
  '/volunteer/apply',
  '/foster',
  '/foster/apply',
  '/donate',
  '/events',
  '/blog',
  '/contact',
  '/resources',
  '/success-stories',
  '/financial-transparency',
  '/lost-found',
  '/privacy-policy',
  '/terms-of-service'
];

// Navigation links - ensure this matches all available links in the site
const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/cats', label: 'Adopt a Cat' },
  { path: '/donate', label: 'Donate' },
  { path: '/volunteer', label: 'Volunteer' },
  { path: '/foster', label: 'Foster' },
  { path: '/events', label: 'Events' },
  { path: '/blog', label: 'Blog' },
  { path: '/success-stories', label: 'Success Stories' },
  { path: '/resources', label: 'Resources' },
  { path: '/lost-found', label: 'Lost & Found' },
  { path: '/contact', label: 'Contact Us' },
  { path: '/financial-transparency', label: 'Financial Transparency' },
];

// Function to extract financial data from Supabase for the financial transparency page
async function getFinancialData() {
  try {
    console.log('Fetching financial data from Supabase...');
    
    // Get donations data
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'completed')
      .order('date', { ascending: false })
      .limit(10);
      
    if (donationsError) throw donationsError;
    
    // Get expenses data
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
      .limit(10);
      
    if (expensesError) throw expensesError;
    
    // Get budget categories
    const { data: budgetCategories, error: budgetError } = await supabase
      .from('budget_categories')
      .select('*');
      
    if (budgetError) throw budgetError;
    
    // Calculate total donations
    const totalDonations = donations.reduce((sum, donation) => sum + (parseFloat(donation.amount) || 0), 0);
    
    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
    
    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    };
    
    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
    
    return {
      totalDonations,
      totalExpenses,
      balance: totalDonations - totalExpenses,
      recentDonations: donations.map(donation => ({
        name: donation.donor_name || 'Anonymous',
        amount: formatCurrency(donation.amount || 0),
        date: formatDate(donation.date)
      })),
      recentExpenses: expenses.map(expense => ({
        category: expense.category || 'Uncategorized',
        amount: formatCurrency(expense.amount || 0),
        date: formatDate(expense.date),
        description: expense.description || 'No description'
      })),
      budgetCategories: budgetCategories.map(category => ({
        name: category.name || 'Uncategorized',
        allocation: formatCurrency(category.allocation || 0)
      }))
    };
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return {
      totalDonations: 0,
      totalExpenses: 0,
      balance: 0,
      recentDonations: [],
      recentExpenses: [],
      budgetCategories: []
    };
  }
}

// Function to generate enhanced content for each main page type
function generateEnhancedContent(route, cats, blogPosts, lostFound, successStories, events, financialData, teamMembers) {
  let content = '';
  
  // Financial Transparency page
  if (route === '/financial-transparency') {
    content = `
      <div class="financial-summary">
        <h2>Financial Summary</h2>
        <div class="financial-stats">
          <div class="stat">
            <h3>Total Donations</h3>
            <p class="amount">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialData.totalDonations)}</p>
          </div>
          <div class="stat">
            <h3>Total Expenses</h3>
            <p class="amount">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialData.totalExpenses)}</p>
          </div>
          <div class="stat">
            <h3>Current Balance</h3>
            <p class="amount">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialData.balance)}</p>
          </div>
        </div>
        
        <div class="financial-tables">
          <div class="recent-donations">
            <h3>Recent Donations</h3>
            <table>
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${financialData.recentDonations.map(donation => `
                  <tr>
                    <td>${donation.name}</td>
                    <td>${donation.amount}</td>
                    <td>${donation.date}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="recent-expenses">
            <h3>Recent Expenses</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${financialData.recentExpenses.map(expense => `
                  <tr>
                    <td>${expense.category}</td>
                    <td>${expense.amount}</td>
                    <td>${expense.date}</td>
                    <td>${expense.description}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="budget-categories">
            <h3>Budget Allocation</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Allocation</th>
                </tr>
              </thead>
              <tbody>
                ${financialData.budgetCategories.map(category => `
                  <tr>
                    <td>${category.name}</td>
                    <td>${category.allocation}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
  // Cats listing page
  else if (route === '/cats') {
    content = `
      <div class="cats-listing">
        <h2>Available Cats for Adoption</h2>
        <p>We currently have ${cats.length} cats available for adoption. Each cat has been vaccinated, spayed/neutered, and is ready to find their forever home.</p>
        
        <div class="cats-grid">
          ${cats.map(cat => `
            <div class="cat-card">
              <h3>${cat.name}</h3>
              <img src="${cat.image_url || cat.images?.[0] || '/placeholder.svg'}" alt="${cat.name}" class="cat-image">
              <div class="cat-info">
                <p><strong>Age:</strong> ${cat.age || 'Unknown'}</p>
                <p><strong>Gender:</strong> ${cat.gender || 'Unknown'}</p>
                <p><strong>Breed:</strong> ${cat.breed || 'Mixed'}</p>
                ${cat.description ? `<p>${cat.description.substring(0, 100)}${cat.description.length > 100 ? '...' : ''}</p>` : ''}
                <a href="/cats/${cat.id}" class="view-details">View Details</a>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="adoption-process">
          <h2>Our Adoption Process</h2>
          <ol>
            <li>Browse our available cats</li>
            <li>Fill out an adoption application</li>
            <li>Meet the cat in person</li>
            <li>Complete the adoption paperwork</li>
            <li>Take your new furry friend home!</li>
          </ol>
        </div>
      </div>
    `;
  }
  // Blog listing page
  else if (route === '/blog') {
    content = `
      <div class="blog-listing">
        <h2>Latest Blog Posts</h2>
        
        <div class="blog-posts">
          ${blogPosts.filter(post => post.published).map(post => `
            <div class="blog-post">
              <h3>${post.title}</h3>
              ${post.published_date ? `<p class="date">Published on ${new Date(post.published_date).toLocaleDateString()}</p>` : ''}
              ${post.featured_image ? `<img src="${post.featured_image}" alt="${post.title}" class="post-image">` : ''}
              ${post.summary ? `<p class="summary">${post.summary}</p>` : ''}
              <a href="/blog/${post.slug}" class="read-more">Read More</a>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  // Lost & Found listing page
  else if (route === '/lost-found') {
    content = `
      <div class="lost-found-listing">
        <h2>Lost & Found Cats</h2>
        <p>Help us reunite lost cats with their families or find homes for cats that have been found.</p>
        
        <div class="lost-found-grid">
          ${lostFound.map(listing => `
            <div class="lost-found-card">
              <h3>${listing.title || (listing.type === 'lost' ? 'Lost Cat' : 'Found Cat')}</h3>
              ${listing.image_url ? `<img src="${listing.image_url}" alt="${listing.title || 'Lost & Found'}" class="listing-image">` : ''}
              <div class="listing-info">
                <p><strong>Status:</strong> ${listing.status || 'Active'}</p>
                <p><strong>Date Reported:</strong> ${listing.date_reported ? new Date(listing.date_reported).toLocaleDateString() : 'Recently'}</p>
                ${listing.description ? `<p>${listing.description.substring(0, 100)}${listing.description.length > 100 ? '...' : ''}</p>` : ''}
                <a href="/lost-found/${listing.id}" class="view-details">View Details</a>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="report-form-info">
          <h2>Report a Lost or Found Cat</h2>
          <p>If you've lost a cat or found one, please fill out our reporting form or contact us directly.</p>
          <a href="/contact" class="contact-link">Contact Us</a>
        </div>
      </div>
    `;
  }
  // Success Stories listing page
  else if (route === '/success-stories') {
    content = `
      <div class="success-stories-listing">
        <h2>Adoption Success Stories</h2>
        <p>Read heartwarming stories of cats we've successfully placed in loving forever homes.</p>
        
        <div class="stories-grid">
          ${successStories.map(story => `
            <div class="story-card">
              <h3>${story.title || 'Success Story'}</h3>
              ${story.image_url || story.images?.[0] ? `<img src="${story.image_url || story.images?.[0]}" alt="${story.title || 'Success Story'}" class="story-image">` : ''}
              <div class="story-info">
                <p><strong>Date:</strong> ${story.date || story.adoption_date ? new Date(story.date || story.adoption_date).toLocaleDateString() : 'Recently'}</p>
                ${story.summary ? `<p class="summary">${story.summary}</p>` : ''}
                <a href="/success-stories/${story.id}" class="view-details">Read Full Story</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  // Events listing page
  else if (route === '/events') {
    content = `
      <div class="events-listing">
        <h2>Upcoming Events</h2>
        <p>Join us at these upcoming events to meet our cats, learn about our mission, or support our cause.</p>
        
        <div class="events-list">
          ${events.map(event => `
            <div class="event-card">
              <h3>${event.title || 'Meow Rescue Event'}</h3>
              <div class="event-info">
                <p><strong>Date:</strong> ${event.date_start ? new Date(event.date_start).toLocaleDateString() : 'TBD'}</p>
                <p><strong>Time:</strong> ${event.time_start || 'TBD'}</p>
                <p><strong>Location:</strong> ${event.location || 'TBD'}</p>
                ${event.description ? `<p>${event.description}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  // About page
  else if (route === '/about') {
    content = `
      <div class="about-page">
        <section class="founder-story">
          <h2>Our Founder's Story</h2>
          <p>Patrick has had a deep connection with animals since childhood, often feeling a special ability to understand them when others couldn't. After years in IT, he decided to follow his true passion for animal welfare—realizing this brings genuine happiness and allows him to use his unique gift.</p>
          <p>The catalyst for Meow Rescue came when Patrick moved to Pasco County about three years ago and observed a significant stray cat population. What started as personally funding vet care and feeding for these animals has now formalized into "Meow Rescue," as Patrick seeks community support to continue and expand this vital work.</p>
        </section>

        <section class="our-mission">
          <h2>Our Mission</h2>
          <p>Our mission is to provide a safe haven for abandoned, neglected, and abused cats. We strive to find loving forever homes for each cat in our care while educating the community on responsible pet ownership.</p>
        </section>

        <section class="meet-team">
          <h2>Meet the Team</h2>
          <div class="team-grid">
            ${teamMembers.map(member => `
              <div class="team-member">
                <img src="${member.avatar_url || 'https://placekitten.com/300/300'}" alt="${member.first_name} ${member.last_name}" />
                <h3>${member.first_name} ${member.last_name}</h3>
                <p class="role">${member.role_title || ''}</p>
                <p class="bio">${member.bio || ''}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }
  
  return content;
}

// Function to fetch team members from Supabase
async function fetchTeamMembers() {
  console.log('Fetching team members from database...');
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty team members array.');
      return [];
    }
    
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
    
    console.log(`Found ${data.length} team members`);
    return data || [];
  } catch (err) {
    console.error('Error in fetchTeamMembers:', err);
    return [];
  }
}

// Function to fetch blog posts from Supabase
async function fetchBlogPosts() {
  console.log('Fetching blog posts from database...');
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty blog posts array.');
      return [];
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
    
    console.log(`Found ${data.length} blog posts`);
    return data || [];
  } catch (err) {
    console.error('Error in fetchBlogPosts:', err);
    return [];
  }
}

// Function to fetch cats from Supabase
async function fetchCats() {
  console.log('Fetching cats from database...');
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty cats array.');
      return [];
    }
    
    const { data, error } = await supabase
      .from('cats')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching cats:', error);
      return [];
    }
    
    console.log(`Found ${data.length} cats`);
    return data || [];
  } catch (err) {
    console.error('Error in fetchCats:', err);
    return [];
  }
}

// Function to fetch events from Supabase
async function fetchEvents() {
  console.log('Fetching events from database...');
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty events array.');
      return [];
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    
    console.log(`Found ${data.length} events`);
    return data || [];
  } catch (err) {
    console.error('Error in fetchEvents:', err);
    return [];
  }
}

// Function to fetch financial data from Supabase
async function fetchFinancialData() {
  console.log('Fetching financial data from Supabase...');
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty financial data.');
      return {
        totalDonations: 0,
        totalExpenses: 0,
        balance: 0,
        recentDonations: [],
        recentExpenses: [],
        budgetCategories: []
      };
    }
    
    // Initialize with default values
    let totalDonations = 0;
    let totalExpenses = 0;
    let balance = 0;
    let recentDonations = [];
    let recentExpenses = [];
    let budgetCategories = [];
    
    try {
      // Fetch donations
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .order('date', { ascending: false });
      
      if (donationsError) {
        console.error('Error fetching donations:', donationsError);
      } else if (donations) {
        recentDonations = donations.slice(0, 5);
        totalDonations = donations.reduce((sum, donation) => sum + (parseFloat(donation.amount) || 0), 0);
      }
      
      // Fetch expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
      
      if (expensesError) {
        console.error('Error fetching expenses:', expensesError);
      } else if (expenses) {
        recentExpenses = expenses.slice(0, 5);
        totalExpenses = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
      }
      
      // Calculate balance
      balance = totalDonations - totalExpenses;
      
      // Fetch budget categories
      const { data: categories, error: categoriesError } = await supabase
        .from('budget_categories')
        .select('*');
      
      if (categoriesError) {
        console.error('Error fetching budget categories:', categoriesError);
      } else if (categories) {
        budgetCategories = categories;
      }
    } catch (err) {
      console.error('Error in financial data processing:', err);
    }
    
    console.log(`Financial data summary: Income: $${totalDonations}, Expenses: $${totalExpenses}, Balance: $${balance}, Transactions: ${recentDonations.length + recentExpenses.length}`);
    
    return {
      totalDonations,
      totalExpenses,
      balance,
      recentDonations,
      recentExpenses,
      budgetCategories
    };
  } catch (err) {
    console.error('Error in fetchFinancialData:', err);
    return {
      totalDonations: 0,
      totalExpenses: 0,
      balance: 0,
      recentDonations: [],
      recentExpenses: [],
      budgetCategories: []
    };
  }
}

// Function to fetch lost and found listings
async function fetchLostFoundListings() {
  console.log('Fetching lost and found listings from database...');
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty lost and found listings array.');
      return [];
    }
    
    // Try using the exact table name used in the live application
    try {
      const { data, error } = await supabase
        .from('lost_found_posts')
        .select('*')
        .neq('status', 'archived')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching lost and found listings:', error);
        return [];
      }
      
      console.log(`Found ${data.length} lost and found listings`);
      return data || [];
    } catch (err) {
      console.error('Error in fetchLostFoundListings:', err);
      return [];
    }
  } catch (err) {
    console.error('Error in fetchLostFoundListings:', err);
    return [];
  }
}

// Function to fetch success stories
async function fetchSuccessStories() {
  console.log('Fetching success stories from database...');
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty success stories array.');
      return [];
    }
    
    const { data, error } = await supabase
      .from('success_stories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching success stories:', error);
      return [];
    }
    
    console.log(`Found ${data.length} success stories`);
    return data || [];
  } catch (err) {
    console.error('Error in fetchSuccessStories:', err);
    return [];
  }
}

// Main function to generate HTML files
async function generateStaticFiles() {
  console.log('Starting enhanced prerendering...');
  
  try {
    // Read the template HTML file
    const templateContent = readFileSync(join(process.cwd(), 'dist', 'index.html'), 'utf-8');
    
    // Fix any issues with script tags in the template
    let templateContentFixed = templateContent
      .replace(/<script.*?><\/script><\/script>/g, '</script>')
      .replace(/src="\.\/ssets\//g, 'src="/assets/')
      .replace(/href="\.\/ssets\//g, 'href="/assets/')
      .replace(/src="\.\/assets\//g, 'src="/assets/')
      .replace(/href="\.\/assets\//g, 'href="/assets/');
    
    // Ensure output directory exists
    const rootDir = join(__dirname, '..');
    const outDir = join(rootDir, 'dist');
    console.log(`Output directory: ${outDir}`);
    
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
      console.log('Created output directory');
    }
    
    // Stats counters
    let successCount = 0;
    let errorCount = 0;
    
    // Fetch all data first
    let cats = await fetchCats();
    let blogPosts = await fetchBlogPosts();
    let lostFound = await fetchLostFoundListings();
    let successStories = await fetchSuccessStories();
    let events = await fetchEvents();
    let financialData = await fetchFinancialData();
    let teamMembers = await fetchTeamMembers();
    
    console.log(`Financial data summary: Income: $${financialData.totalDonations}, Expenses: $${financialData.totalExpenses}, Balance: $${financialData.balance}, Transactions: ${financialData.recentDonations.length + financialData.recentExpenses.length}`);
    
    // Generate enhanced HTML for each route with proper SEO tags
    for (const route of routes) {
      try {
        // Write the file - use nested structure for main pages
        // For routes like '/about', write to '/about/index.html' instead of 'about.html'
        const routePath = route === '/' ? '' : route;
        const routeDir = join(outDir, routePath.substring(1));
        
        // Create directory if it doesn't exist
        if (!existsSync(routeDir)) {
          mkdirSync(routeDir, { recursive: true });
        }
        
        const outputPath = route === '/' 
          ? join(outDir, 'index.html')
          : join(routeDir, 'index.html');
        
        // Generate HTML with proper SEO tags for this route
        const pageTitle = route === '/' 
          ? 'Meow Rescue - Cat Adoption & Foster Care' 
          : `${route.substring(1).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - Meow Rescue`;
        
        const pageDescription = route === '/' 
          ? 'MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need.'
          : `Learn about ${route.substring(1)} at Meow Rescue, a home-based cat rescue in Pasco County, Florida.`;
        
        // Enhanced content for specific pages (especially Financial Transparency)
        let enhancedFallbackContent = generateEnhancedContent(route, cats, blogPosts, lostFound, successStories, events, financialData, teamMembers);
        
        // Create enhanced HTML with proper SEO tags and template replacement
        let enhancedHtml = templateContentFixed
          .replace('<title>Meow Rescue</title>', `<title>${pageTitle}</title>`)
          .replace('<meta name="description" content="Meow Rescue">', `<meta name="description" content="${pageDescription}">`)
          .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${SEO_DOMAIN}${route}">`)
          .replace('<meta property="og:title" content="">', `<meta property="og:title" content="${pageTitle}">`)
          .replace('<meta property="og:description" content="">', `<meta property="og:description" content="${pageDescription}">`)
          .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${SEO_DOMAIN}${route}">`)
          .replace('<div id="root"></div>', `
            <div id="root"></div>
            <div class="fallback-content">
              <h1>${pageTitle}</h1>
              <p>${pageDescription}</p>
              ${enhancedFallbackContent}
              <nav class="fallback-nav">
                <ul>
                  <li><a href="/">Home</a></li>
                ${navLinks.map(link => `<li><a href="${link.path}">${link.label}</a></li>`).join('\n                ')}
                </ul>
              </nav>
            </div>
          `)
          // Fix script and asset paths to be relative rather than absolute
          .replace(/src="\/assets\//g, 'src="/assets/')
          .replace(/href="\/assets\//g, 'href="/assets/')
          .replace(/src="\/src\//g, 'src="/src/');
        
        // Update: Allow Unsplash images by adding unsplash.com to img-src
        enhancedHtml = enhancedHtml.replace(/(<meta http-equiv="Content-Security-Policy" content=")([^"]*)"/g, function(match, p1, p2) {
          if (p2.includes('img-src')) {
            return p1 + p2.replace(
              /(img-src [^;]*)/,
              function(imgSrc) {
                if (!imgSrc.includes('images.unsplash.com')) {
                  return imgSrc + ' https://images.unsplash.com';
                }
                return imgSrc;
              }
            ) + '"';
          }
          return match;
        });
        
        // Add navigation initialization script to the template
        // This ensures navigation works correctly when accessing subpages directly
        const navigationScript = `
        <script>
          // Early navigation initialization to handle direct access to subpages
          (function() {
            // Make sure links work without JavaScript
            document.addEventListener('click', function(e) {
              const target = e.target.closest('a');
              if (target && 
                  target.href && 
                  target.href.startsWith(window.location.origin) && 
                  !target.getAttribute('target') && 
                  !target.hasAttribute('download') &&
                  !target.hasAttribute('data-no-intercept')) {
                
                e.preventDefault();
                window.history.pushState({}, '', target.href);
                
                // Trigger a navigation event that React Router can listen to
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            });
            
            // Handle direct navigation to subpages
            window.addEventListener('load', function() {
              // Force React Router to recognize the current URL
              setTimeout(function() {
                window.dispatchEvent(new PopStateEvent('popstate'));
              }, 0);
            });
          })();
        </script>`;
        
        // Insert the navigation script right before the closing head tag
        enhancedHtml = enhancedHtml.replace('</head>', `${navigationScript}\n</head>`);
        
        // Ensure the JavaScript is included
        let finalHtml = enhancedHtml.includes('src="/assets/main.js"') 
          ? enhancedHtml 
          : enhancedHtml.replace('</body>', '  <script type="module" src="/assets/main.js"></script>\n  </body>');
        
        // Write the file
        writeFileSync(outputPath, finalHtml);
        console.log(`Generated HTML for ${route} at ${outputPath}`);
        successCount++;
      } catch (error) {
        console.error(`Error generating HTML for ${route}:`, error);
        errorCount++;
      }
    }
    
    // Generate static HTML for each blog post
    if (blogPosts.length > 0) {
      const blogDir = join(outDir, 'blog');
      if (!existsSync(blogDir)) {
        mkdirSync(blogDir, { recursive: true });
      }
      
      // Always make sure there's an index.html file in the blog directory
      if (!existsSync(join(blogDir, 'index.html'))) {
        // Create basic blog index file that duplicates the content from the blog.html generation
        const blogIndexContent = generateEnhancedContent('/blog', cats, blogPosts, lostFound, successStories, events, financialData, teamMembers);
        
        const blogIndexHtml = templateContentFixed
          .replace('<title>Meow Rescue</title>', `<title>Blog - Meow Rescue</title>`)
          .replace('<meta name="description" content="Meow Rescue">', `<meta name="description" content="Read the latest updates and news from Meow Rescue.">`)
          .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${SEO_DOMAIN}/blog">`)
          .replace('<meta property="og:title" content="">', `<meta property="og:title" content="Blog - Meow Rescue">`)
          .replace('<meta property="og:description" content="">', `<meta property="og:description" content="Read the latest updates and news from Meow Rescue.">`)
          .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${SEO_DOMAIN}/blog">`)
          .replace('<div id="root"></div>', `
            <div id="root"></div>
            <div class="fallback-content">
              <h1>Blog - Meow Rescue</h1>
              <p>Read the latest updates and news from Meow Rescue.</p>
              ${blogIndexContent}
              <nav class="fallback-nav">
                <ul>
                  <li><a href="/">Home</a></li>
                ${navLinks.map(link => `<li><a href="${link.path}">${link.label}</a></li>`).join('\n                ')}
                </ul>
              </nav>
            </div>
          `);
        
        // Ensure the JavaScript is included
        let finalHtml = blogIndexHtml.includes('src="/assets/main.js"') 
          ? blogIndexHtml 
          : blogIndexHtml.replace('</body>', '  <script type="module" src="/assets/main.js"></script>\n  </body>');
        
        writeFileSync(join(blogDir, 'index.html'), finalHtml);
        console.log(`Generated HTML for blog index at ${join(blogDir, 'index.html')}`);
      }
      
      for (const post of blogPosts) {
        try {
          // Only create HTML for published posts with a slug
          if (!post.slug || (post.published !== undefined && !post.published)) continue;
          
          // Use flat HTML files in the blog directory
          const postOutputPath = join(blogDir, `${post.slug}.html`);
          
          // Generate HTML with proper SEO tags for this blog post
          const postTitle = `${post.title || 'Blog Post'} - Meow Rescue Blog`;
          const postDescription = post.summary?.substring(0, 160) || post.content?.substring(0, 160) || 'Read the latest news and updates from Meow Rescue.';
          
          // Create enhanced HTML with proper SEO tags
          let enhancedHtml = templateContentFixed
            .replace('<title>Meow Rescue</title>', `<title>${postTitle}</title>`)
            .replace('<meta name="description" content="Meow Rescue">', `<meta name="description" content="${postDescription}">`)
            .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${SEO_DOMAIN}/blog/${post.slug}">`)
            .replace('<meta property="og:title" content="">', `<meta property="og:title" content="${postTitle}">`)
            .replace('<meta property="og:description" content="">', `<meta property="og:description" content="${postDescription}">`)
            .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${SEO_DOMAIN}/blog/${post.slug}">`)
            .replace('<meta property="og:image" content="">', `<meta property="og:image" content="${post.featured_image || `${SEO_DOMAIN}/placeholder.svg`}">`)
            .replace('<div id="root"></div>', `
              <div id="root"></div>
              <div class="fallback-content">
                <h1>${post.title || 'Blog Post'}</h1>
                <div class="post-details">
                  ${post.featured_image ? `<img src="${post.featured_image}" alt="${post.title || 'Blog Post'}" class="post-image">` : ''}
                  <div class="post-info">
                    <p><strong>Date:</strong> ${post.published_date ? new Date(post.published_date).toLocaleDateString() : 'Recently'}</p>
                    ${post.summary ? `<p class="summary">${post.summary}</p>` : ''}
                    <div class="post-content">
                      ${post.content || 'No content available.'}
                    </div>
                    <a href="/blog" class="back-link">Back to Blog</a>
                  </div>
                </div>
              </div>
            `);
          
          // Ensure the JavaScript is included
          let finalHtml = enhancedHtml.includes('src="/assets/main.js"') 
            ? enhancedHtml 
            : enhancedHtml.replace('</body>', '  <script type="module" src="/assets/main.js"></script>\n  </body>');
          
          // Update asset paths for being one level deep
          let fixedHtml = finalHtml
            .replace(/src="\.\/assets\//g, 'src="/assets/')
            .replace(/href="\.\/assets\//g, 'href="/assets/')
            .replace(/src="\.\/ssets\//g, 'src="/assets/')
            .replace(/href="\.\/ssets\//g, 'href="/assets/');
          
          writeFileSync(postOutputPath, fixedHtml);
          console.log(`Generated HTML for blog post "${post.title || post.slug}" at ${postOutputPath}`);
          successCount++;
        } catch (error) {
          console.error(`Error generating HTML for blog post "${post.title || post.slug}":`, error);
          errorCount++;
        }
      }
    }
    
    // Generate static HTML for each cat
    if (cats.length > 0) {
      const catsDir = join(outDir, 'cats');
      if (!existsSync(catsDir)) {
        mkdirSync(catsDir, { recursive: true });
      }
      
      // Always make sure there's an index.html file in the cats directory
      if (!existsSync(join(catsDir, 'index.html'))) {
        // Create basic cats index file that duplicates the content from the cats.html generation
        const catsIndexContent = generateEnhancedContent('/cats', cats, blogPosts, lostFound, successStories, events, financialData, teamMembers);
        
        const catsIndexHtml = templateContentFixed
          .replace('<title>Meow Rescue</title>', `<title>Adopt a Cat - Meow Rescue</title>`)
          .replace('<meta name="description" content="Meow Rescue">', `<meta name="description" content="Browse cats available for adoption at Meow Rescue.">`)
          .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${SEO_DOMAIN}/cats">`)
          .replace('<meta property="og:title" content="">', `<meta property="og:title" content="Adopt a Cat - Meow Rescue">`)
          .replace('<meta property="og:description" content="">', `<meta property="og:description" content="Browse cats available for adoption at Meow Rescue.">`)
          .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${SEO_DOMAIN}/cats">`)
          .replace('<div id="root"></div>', `
            <div id="root"></div>
            <div class="fallback-content">
              <h1>Adopt a Cat - Meow Rescue</h1>
              <p>Browse cats available for adoption at Meow Rescue.</p>
              ${catsIndexContent}
              <nav class="fallback-nav">
                <ul>
                  <li><a href="/">Home</a></li>
                ${navLinks.map(link => `<li><a href="${link.path}">${link.label}</a></li>`).join('\n                ')}
                </ul>
              </nav>
            </div>
          `);
        
        // Ensure the JavaScript is included
        let finalHtml = catsIndexHtml.includes('src="/assets/main.js"') 
          ? catsIndexHtml 
          : catsIndexHtml.replace('</body>', '  <script type="module" src="/assets/main.js"></script>\n  </body>');
        
        writeFileSync(join(catsDir, 'index.html'), finalHtml);
        console.log(`Generated HTML for cats index at ${join(catsDir, 'index.html')}`);
      }
      
      for (const cat of cats) {
        try {
          // Use flat HTML files in the cats directory (not nested subdirectories)
          const catOutputPath = join(catsDir, `${cat.id}.html`);
          
          // Generate HTML with proper SEO tags for this cat
          const catTitle = `${cat.name} - Adopt a Cat | Meow Rescue`;
          const catDescription = cat.description?.substring(0, 160) || `Adopt ${cat.name}, a ${cat.age || 'lovely'} ${cat.breed || 'cat'} at Meow Rescue in Pasco County, Florida.`;
          
          // Create enhanced HTML with proper SEO tags
          let enhancedHtml = templateContentFixed
            .replace('<title>Meow Rescue</title>', `<title>${catTitle}</title>`)
            .replace('<meta name="description" content="Meow Rescue">', `<meta name="description" content="${catDescription}">`)
            .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${SEO_DOMAIN}/cats/${cat.id}">`)
            .replace('<meta property="og:title" content="">', `<meta property="og:title" content="${catTitle}">`)
            .replace('<meta property="og:description" content="">', `<meta property="og:description" content="${catDescription}">`)
            .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${SEO_DOMAIN}/cats/${cat.id}">`)
            .replace('<meta property="og:image" content="">', `<meta property="og:image" content="${cat.image_url || cat.images?.[0] || `${SEO_DOMAIN}/placeholder.svg`}">`)
            .replace('<div id="root"></div>', `
              <div id="root"></div>
              <div class="fallback-content">
                <h1>${cat.name}</h1>
                <div class="cat-details">
                  <img src="${cat.image_url || cat.images?.[0] || '/placeholder.svg'}" alt="${cat.name}" class="cat-image">
                  <div class="cat-info">
                    <p><strong>Age:</strong> ${cat.age || 'Unknown'}</p>
                    <p><strong>Gender:</strong> ${cat.gender || 'Unknown'}</p>
                    <p><strong>Breed:</strong> ${cat.breed || 'Mixed'}</p>
                    <p><strong>Color:</strong> ${cat.color || 'Various'}</p>
                    <p>${cat.description || 'A lovely cat waiting for adoption.'}</p>
                    <a href="/cats" class="back-link">View all cats</a>
                  </div>
                </div>
              </div>
            `);
          
          // Ensure the JavaScript is included
          let finalHtml = enhancedHtml.includes('src="/assets/main.js"') 
            ? enhancedHtml 
            : enhancedHtml.replace('</body>', '  <script type="module" src="/assets/main.js"></script>\n  </body>');
          
          // Update asset paths for being one level deep
          let fixedHtml = finalHtml
            .replace(/src="\.\/assets\//g, 'src="/assets/')
            .replace(/href="\.\/assets\//g, 'href="/assets/')
            .replace(/src="\.\/ssets\//g, 'src="/assets/')
            .replace(/href="\.\/ssets\//g, 'href="/assets/');
          
          writeFileSync(catOutputPath, fixedHtml);
          console.log(`Generated HTML for cat "${cat.name}" at ${catOutputPath}`);
          successCount++;
        } catch (error) {
          console.error(`Error generating HTML for cat "${cat.name}":`, error);
          errorCount++;
        }
      }
    }
    
    // Generate static HTML for each event
    if (events.length > 0) {
      const eventsDir = join(outDir, 'events');
      if (!existsSync(eventsDir)) {
        mkdirSync(eventsDir, { recursive: true });
      }
      
      for (const event of events) {
        try {
          // Create directory for each event
          const eventDir = join(eventsDir, event.id.toString());
          if (!existsSync(eventDir)) {
            mkdirSync(eventDir, { recursive: true });
          }
          
          // Format event date
          const eventDate = event.date_start ? new Date(event.date_start).toLocaleDateString() : 'TBA';
          
          // Generate HTML with proper SEO tags for this event
          const eventTitle = `${event.title} - Meow Rescue Events`;
          const eventDescription = `Join us for ${event.title} on ${eventDate}. ${event.short_description || 'An event by Meow Rescue to support cat adoption and rescue in Pasco County, Florida.'}`;
          const eventUrl = `/events/${event.id}`;
          
          // Create enhanced HTML with proper SEO tags and template replacement
          let enhancedHtml = templateContentFixed
            .replace('<title>Meow Rescue</title>', `<title>${eventTitle}</title>`)
            .replace('<meta name="description" content="Meow Rescue">', `<meta name="description" content="${eventDescription}">`)
            .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${SEO_DOMAIN}${eventUrl}">`)
            .replace('<meta property="og:title" content="">', `<meta property="og:title" content="${eventTitle}">`)
            .replace('<meta property="og:description" content="">', `<meta property="og:description" content="${eventDescription}">`)
            .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${SEO_DOMAIN}${eventUrl}">`)
            .replace('<div id="root"></div>', `
              <div id="root"></div>
              <div class="fallback-content">
                <h1>${eventTitle}</h1>
                <p>${eventDescription}</p>
                
                <div class="event-details">
                  <p><strong>Date:</strong> ${eventDate}</p>
                  ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ''}
                  ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                </div>
                
                <nav class="fallback-nav">
                  <ul>
                    <li><a href="/events">Back to All Events</a></li>
                    ${navLinks.map(link => `<li><a href="${link.path}">${link.label}</a></li>`).join('\n                    ')}
                  </ul>
                </nav>
              </div>
            `)
            // Fix script and asset paths to be relative rather than absolute
            .replace(/src="\/assets\//g, 'src="/assets/')
            .replace(/href="\/assets\//g, 'href="/assets/')
            .replace(/src="\/src\//g, 'src="/src/');
          
          // Ensure the JavaScript is included
          let finalHtml = enhancedHtml.includes('src="/assets/main.js"') 
            ? enhancedHtml 
            : enhancedHtml.replace('</body>', '  <script type="module" src="/assets/main.js"></script>\n  </body>');
          
          // Write the file
          const outputPath = join(eventDir, 'index.html');
        
          // Fix asset paths for proper Netlify deployment
          // Calculate relative depth for assets path
          const depth = 2;
          const assetsPath = depth === 0 ? '/assets/' : '../'.repeat(depth) + 'assets/';
          
          // Replace absolute paths with relative ones and ensure main.js is included
          let finalHtmlFixed = enhancedHtml
            .replace(/src="\/assets\//g, `src="${assetsPath}`)
            .replace(/href="\/assets\//g, `href="${assetsPath}`)
            .replace(/src="\.\/ssets\//g, `src="${assetsPath}`)
            .replace(/href="\.\/ssets\//g, `href="${assetsPath}`)
            .replace(/<script.*?><\/script><\/script>/g, '</script>');
          
          writeFileSync(outputPath, finalHtmlFixed);
          console.log(`Generated HTML for event "${event.title}" at ${outputPath}`);
          successCount++;
        } catch (error) {
          console.error(`Error generating HTML for event "${event.title}":`, error);
          errorCount++;
        }
      }
    }
    
    // Generate static HTML for each lost and found listing
    if (lostFound.length > 0) {
      const lostFoundDir = join(outDir, 'lost-found');
      if (!existsSync(lostFoundDir)) {
        mkdirSync(lostFoundDir, { recursive: true });
      }
      
      // Always make sure there's an index.html file in the lost-found directory
      if (!existsSync(join(lostFoundDir, 'index.html'))) {
        // Create basic lost-found index file that duplicates the content from the lost-found.html generation
        const lostFoundIndexContent = generateEnhancedContent('/lost-found', cats, blogPosts, lostFound, successStories, events, financialData, teamMembers);
        
        const lostFoundIndexHtml = templateContentFixed
          .replace('<title>Meow Rescue</title>', `<title>Lost & Found - Meow Rescue</title>`)
          .replace('<meta name="description" content="Meow Rescue">', `<meta name="description" content="Help us reunite lost cats with their families at Meow Rescue.">`)
          .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${SEO_DOMAIN}/lost-found">`)
          .replace('<meta property="og:title" content="">', `<meta property="og:title" content="Lost & Found - Meow Rescue">`)
          .replace('<meta property="og:description" content="">', `<meta property="og:description" content="Help us reunite lost cats with their families at Meow Rescue.">`)
          .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${SEO_DOMAIN}/lost-found">`)
          .replace('<div id="root"></div>', `
            <div id="root"></div>
            <div class="fallback-content">
              <h1>Lost & Found - Meow Rescue</h1>
              <p>Help us reunite lost cats with their families at Meow Rescue.</p>
              ${lostFoundIndexContent}
              <nav class="fallback-nav">
                <ul>
                  <li><a href="/">Home</a></li>
                ${navLinks.map(link => `<li><a href="${link.path}">${link.label}</a></li>`).join('\n                ')}
                </ul>
              </nav>
            </div>
          `);
        
        // Ensure the JavaScript is included
        let finalHtml = lostFoundIndexHtml.includes('src="/assets/main.js"') 
          ? lostFoundIndexHtml 
          : lostFoundIndexHtml.replace('</body>', '  <script type="module" src="/assets/main.js"></script>\n  </body>');
        
        writeFileSync(join(lostFoundDir, 'index.html'), finalHtml);
        console.log(`Generated HTML for lost & found index at ${join(lostFoundDir, 'index.html')}`);
      }
      
      for (const listing of lostFound) {
        try {
          // Use flat HTML files in the lost-found directory
          const listingOutputPath = join(lostFoundDir, `${listing.id}.html`);
          
          // Generate HTML with proper SEO tags for this listing
          const listingTitle = `${listing.title || 'Lost & Found Report'} - Meow Rescue`;
          const listingDescription = listing.description?.substring(0, 160) || 'Help us find lost cats and reunite them with their families.';
          
          // Create enhanced HTML with proper SEO tags
          let enhancedHtml = templateContentFixed
            .replace('<title>Meow Rescue</title>', `<title>${listingTitle}</title>`)
            .replace('<meta name="description" content="Meow Rescue">', `<meta name="description" content="${listingDescription}">`)
            .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${SEO_DOMAIN}/lost-found/${listing.id}">`)
            .replace('<meta property="og:title" content="">', `<meta property="og:title" content="${listingTitle}">`)
            .replace('<meta property="og:description" content="">', `<meta property="og:description" content="${listingDescription}">`)
            .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${SEO_DOMAIN}/lost-found/${listing.id}">`)
            .replace('<meta property="og:image" content="">', `<meta property="og:image" content="${listing.image_url || `${SEO_DOMAIN}/placeholder.svg`}">`)
            .replace('<div id="root"></div>', `
              <div id="root"></div>
              <div class="fallback-content">
                <h1>${listing.title || 'Lost & Found Report'}</h1>
                <div class="listing-details">
                  <img src="${listing.image_url || '/placeholder.svg'}" alt="${listing.title || 'Lost & Found'}" class="listing-image">
                  <div class="listing-info">
                    <p><strong>Status:</strong> ${listing.status || 'Active'}</p>
                    <p><strong>Date Reported:</strong> ${listing.date_reported || listing.created_at || 'Recently'}</p>
                    <p>${listing.description || 'No additional details provided.'}</p>
                    <a href="/lost-found" class="back-link">Back to Lost & Found</a>
                  </div>
                </div>
              </div>
            `);
          
          // Ensure the JavaScript is included
          let finalHtml = enhancedHtml.includes('src="/assets/main.js"') 
            ? enhancedHtml 
            : enhancedHtml.replace('</body>', '  <script type="module" src="/assets/main.js"></script>\n  </body>');
          
          // Update asset paths for being one level deep
          let fixedHtml = finalHtml
            .replace(/src="\.\/assets\//g, 'src="/assets/')
            .replace(/href="\.\/assets\//g, 'href="/assets/')
            .replace(/src="\.\/ssets\//g, 'src="/assets/')
            .replace(/href="\.\/ssets\//g, 'href="/assets/');
          
          writeFileSync(listingOutputPath, fixedHtml);
          console.log(`Generated HTML for lost & found listing "${listing.title || listing.id}" at ${listingOutputPath}`);
          successCount++;
        } catch (error) {
          console.error(`Error generating HTML for lost & found listing "${listing.title || listing.id}":`, error);
          errorCount++;
        }
      }
    }
    
    // Generate static HTML for each success story
    if (successStories.length > 0) {
      const storiesDir = join(outDir, 'success-stories');
      if (!existsSync(storiesDir)) {
        mkdirSync(storiesDir, { recursive: true });
      }
      
      // Always make sure there's an index.html file in the success-stories directory
      if (!existsSync(join(storiesDir, 'index.html'))) {
        // Create basic success-stories index file that duplicates the content
        const storiesIndexContent = generateEnhancedContent('/success-stories', cats, blogPosts, lostFound, successStories, events, financialData, teamMembers);
        
        const storiesIndexHtml = templateContentFixed
          .replace('<title>Meow Rescue</title>', `<title>Success Stories - Meow Rescue</title>`)
          .replace('<meta name="description" content="Meow Rescue">', `<meta name="description" content="Read heartwarming stories of cats we've successfully placed in loving forever homes.">`)
          .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${SEO_DOMAIN}/success-stories">`)
          .replace('<meta property="og:title" content="">', `<meta property="og:title" content="Success Stories - Meow Rescue">`)
          .replace('<meta property="og:description" content="">', `<meta property="og:description" content="Read heartwarming stories of cats we've successfully placed in loving forever homes.">`)
          .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${SEO_DOMAIN}/success-stories">`)
          .replace('<div id="root"></div>', `
            <div id="root"></div>
            <div class="fallback-content">
              <h1>Success Stories - Meow Rescue</h1>
              <p>Read heartwarming stories of cats we've successfully placed in loving forever homes.</p>
              ${storiesIndexContent}
              <nav class="fallback-nav">
                <ul>
                  <li><a href="/">Home</a></li>
                ${navLinks.map(link => `<li><a href="${link.path}">${link.label}</a></li>`).join('\n                ')}
                </ul>
              </nav>
            </div>
          `);
        
        // Ensure the JavaScript is included
        let finalHtml = storiesIndexHtml.includes('src="/assets/main.js"') 
          ? storiesIndexHtml 
          : storiesIndexHtml.replace('</body>', '  <script type="module" src="/assets/main.js"></script>\n  </body>');
        
        writeFileSync(join(storiesDir, 'index.html'), finalHtml);
        console.log(`Generated HTML for success stories index at ${join(storiesDir, 'index.html')}`);
      }
      
      for (const story of successStories) {
        try {
          // Use flat HTML files in the success-stories directory
          const storyOutputPath = join(storiesDir, `${story.id}.html`);
          
          // Generate HTML with proper SEO tags for this story
          const storyTitle = `${story.title || 'Success Story'} - Meow Rescue`;
          const storyDescription = story.description?.substring(0, 160) || story.summary?.substring(0, 160) || 'Read about our successful cat adoptions and rescues.';
          
          // Create enhanced HTML with proper SEO tags
          let enhancedHtml = templateContentFixed
            .replace('<title>Meow Rescue</title>', `<title>${storyTitle}</title>`)
            .replace('<meta name="description" content="Meow Rescue">', `<meta name="description" content="${storyDescription}">`)
            .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${SEO_DOMAIN}/success-stories/${story.id}">`)
            .replace('<meta property="og:title" content="">', `<meta property="og:title" content="${storyTitle}">`)
            .replace('<meta property="og:description" content="">', `<meta property="og:description" content="${storyDescription}">`)
            .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${SEO_DOMAIN}/success-stories/${story.id}">`)
            .replace('<meta property="og:image" content="">', `<meta property="og:image" content="${story.image_url || story.images?.[0] || `${SEO_DOMAIN}/placeholder.svg`}">`)
            .replace('<div id="root"></div>', `
              <div id="root"></div>
              <div class="fallback-content">
                <h1>${story.title || 'Success Story'}</h1>
                <div class="story-details">
                  <img src="${story.image_url || story.images?.[0] || '/placeholder.svg'}" alt="${story.title || 'Success Story'}" class="story-image">
                  <div class="story-info">
                    <p><strong>Date:</strong> ${story.date || story.adoption_date ? new Date(story.date || story.adoption_date).toLocaleDateString() : 'Recently'}</p>
                    ${story.summary ? `<p class="summary">${story.summary}</p>` : ''}
                    <div class="story-content">
                      ${story.description || story.content || 'No additional details provided.'}
                    </div>
                    <a href="/success-stories" class="back-link">Back to Success Stories</a>
                  </div>
                </div>
              </div>
            `);
          
          // Ensure the JavaScript is included
          let finalHtml = enhancedHtml.includes('src="/assets/main.js"') 
            ? enhancedHtml 
            : enhancedHtml.replace('</body>', '  <script type="module" src="/assets/main.js"></script>\n  </body>');
          
          // Update asset paths for being one level deep
          let fixedHtml = finalHtml
            .replace(/src="\.\/assets\//g, 'src="/assets/')
            .replace(/href="\.\/assets\//g, 'href="/assets/')
            .replace(/src="\.\/ssets\//g, 'src="/assets/')
            .replace(/href="\.\/ssets\//g, 'href="/assets/');
          
          writeFileSync(storyOutputPath, fixedHtml);
          console.log(`Generated HTML for success story "${story.title || story.id}" at ${storyOutputPath}`);
          successCount++;
        } catch (error) {
          console.error(`Error generating HTML for success story "${story.title || story.id}":`, error);
          errorCount++;
        }
      }
    }
    
    // Generate static HTML for routes that have apply pages
    const applyRoutes = [
      { 
        parent: '/volunteer', 
        path: '/volunteer/apply',
        title: 'Volunteer Application - Meow Rescue',
        description: 'Apply to become a volunteer at Meow Rescue. Help us make a difference in the lives of cats throughout Pasco County.'
      },
      { 
        parent: '/foster', 
        path: '/foster/apply',
        title: 'Foster Application - Meow Rescue',
        description: 'Apply to become a foster parent for cats in need. Help provide temporary homes for cats waiting for their forever families.'
      }
    ];

    for (const route of applyRoutes) {
      try {
        // Create directory for the route
        const applyDir = join(outDir, route.path.substring(1));
        if (!existsSync(applyDir)) {
          mkdirSync(applyDir, { recursive: true });
        }
        
        // Create enhanced HTML with proper SEO tags and template replacement
        let enhancedHtml = templateContentFixed
          .replace('<title>Meow Rescue</title>', `<title>${route.title}</title>`)
          .replace('<meta name="description" content="Meow Rescue">', `<meta name="description" content="${route.description}">`)
          .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${SEO_DOMAIN}${route.path}">`)
          .replace('<meta property="og:title" content="">', `<meta property="og:title" content="${route.title}">`)
          .replace('<meta property="og:description" content="">', `<meta property="og:description" content="${route.description}">`)
          .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${SEO_DOMAIN}${route.path}">`)
          .replace('<div id="root"></div>', `
            <div id="root"></div>
            <div class="fallback-content">
              <h1>${route.title}</h1>
              <p>${route.description}</p>
              
              <h2>Application Form</h2>
              <p>This form allows you to apply to ${route.parent === '/volunteer' ? 'volunteer' : 'foster'} with Meow Rescue. JavaScript is required to submit this form.</p>
              
              <nav class="fallback-nav">
                <ul>
                  <li><a href="${route.parent}">Back to ${route.parent === '/volunteer' ? 'Volunteer' : 'Foster'} Information</a></li>
                  ${navLinks.map(link => `<li><a href="${link.path}">${link.label}</a></li>`).join('\n                  ')}
                </ul>
              </nav>
            </div>
          `)
          // Fix script and asset paths to be relative rather than absolute
          .replace(/src="\/assets\//g, 'src="/assets/')
          .replace(/href="\/assets\//g, 'href="/assets/')
          .replace(/src="\/src\//g, 'src="/src/');
        
        // Add navigation initialization script to the template
        // This ensures navigation works correctly when accessing subpages directly
        const navigationScript = `
        <script>
          // Early navigation initialization to handle direct access to subpages
          (function() {
            // Make sure links work without JavaScript
            document.addEventListener('click', function(e) {
              const target = e.target.closest('a');
              if (target && 
                  target.href && 
                  target.href.startsWith(window.location.origin) && 
                  !target.getAttribute('target') && 
                  !target.hasAttribute('download') &&
                  !target.hasAttribute('data-no-intercept')) {
                
                e.preventDefault();
                window.history.pushState({}, '', target.href);
                
                // Trigger a navigation event that React Router can listen to
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            });
            
            // Handle direct navigation to subpages
            window.addEventListener('load', function() {
              // Force React Router to recognize the current URL
              setTimeout(function() {
                window.dispatchEvent(new PopStateEvent('popstate'));
              }, 0);
            });
          })();
        </script>`;
        
        // Insert the navigation script right before the closing head tag
        enhancedHtml = enhancedHtml.replace('</head>', `${navigationScript}\n</head>`);
        
        // Ensure the JavaScript is included
        let finalHtml = enhancedHtml.includes('src="/assets/main.js"') 
          ? enhancedHtml 
          : enhancedHtml.replace('</body>', '  <script type="module" src="/assets/main.js"></script>\n  </body>');
        
        // Write the file
        const outputPath = join(applyDir, 'index.html');
        
        // Fix asset paths for proper Netlify deployment
        // Calculate relative depth for assets path
        const depth = route.path.split('/').filter(Boolean).length;
        const assetsPath = depth === 0 ? '/assets/' : '../'.repeat(depth) + 'assets/';
        
        // Replace absolute paths with relative ones and ensure main.js is included
        let finalHtmlFixed = enhancedHtml
          .replace(/src="\/assets\//g, `src="${assetsPath}`)
          .replace(/href="\/assets\//g, `href="${assetsPath}`)
          .replace(/src="\.\/ssets\//g, `src="${assetsPath}`)
          .replace(/href="\.\/ssets\//g, `href="${assetsPath}`)
          .replace(/<script.*?><\/script><\/script>/g, '</script>');
        
        // Ensure main.js script tag exists
        if (!finalHtmlFixed.includes('main.js')) {
          finalHtmlFixed = finalHtmlFixed.replace('</body>', `  <script type="module" src="${assetsPath}main.js"></script>\n  </body>`);
        }
        
        writeFileSync(outputPath, finalHtmlFixed);
        console.log(`Generated HTML for ${route.path} at ${outputPath}`);
        successCount++;
      } catch (error) {
        console.error(`Error generating HTML for ${route.path}:`, error);
        errorCount++;
      }
    }
    
    // Verify and update URLs in sitemap based on our new directory structure
    console.log('Verifying sitemap URLs...');
    
    // Double-check all directories to fetch actual entity IDs that were generated
    console.log('\nScanning generated directories for entity pages...');
    // Arrays to store the actual entity IDs found
    let generatedCatIds = [];
    let generatedEventIds = [];  
    let generatedLostFoundIds = [];
    let generatedSuccessStoryIds = [];
    let generatedBlogPostIds = [];
    
    // Scan cat directory for actual generated pages
    if (existsSync(join(outDir, 'cats'))) {
      try {
        generatedCatIds = readdirSync(join(outDir, 'cats'), { withFileTypes: true })
          .filter(dirent => dirent.isFile() && dirent.name.endsWith('.html'))
          .map(dirent => dirent.name.replace('.html', ''));
        console.log(`Found ${generatedCatIds.length} generated cat pages`);
      } catch (err) {
        console.error('Error scanning cats directory:', err);
      }
    }
    
    // Scan events directory for actual generated pages
    if (existsSync(join(outDir, 'events'))) {
      try {
        generatedEventIds = readdirSync(join(outDir, 'events'), { withFileTypes: true })
          .filter(dirent => dirent.isFile() && dirent.name.endsWith('.html'))
          .map(dirent => dirent.name.replace('.html', ''));
        console.log(`Found ${generatedEventIds.length} generated event pages`);  
      } catch (err) {
        console.error('Error scanning events directory:', err);
      }
    }
    
    // Scan lost-found directory for actual generated pages
    if (existsSync(join(outDir, 'lost-found'))) {
      try {
        generatedLostFoundIds = readdirSync(join(outDir, 'lost-found'), { withFileTypes: true })
          .filter(dirent => dirent.isFile() && dirent.name.endsWith('.html'))
          .map(dirent => dirent.name.replace('.html', ''));
        console.log(`Found ${generatedLostFoundIds.length} generated lost & found pages`);
      } catch (err) {
        console.error('Error scanning lost-found directory:', err);
      }
    }
    
    // Scan success-stories directory for actual generated pages
    if (existsSync(join(outDir, 'success-stories'))) {
      try {
        generatedSuccessStoryIds = readdirSync(join(outDir, 'success-stories'), { withFileTypes: true })
          .filter(dirent => dirent.isFile() && dirent.name.endsWith('.html'))
          .map(dirent => dirent.name.replace('.html', ''));
        console.log(`Found ${generatedSuccessStoryIds.length} generated success story pages`);
      } catch (err) {
        console.error('Error scanning success-stories directory:', err);
      }
    }
    
    // Scan blog directory for actual generated pages
    if (existsSync(join(outDir, 'blog'))) {
      try {
        generatedBlogPostIds = readdirSync(join(outDir, 'blog'), { withFileTypes: true })
          .filter(dirent => dirent.isFile() && dirent.name.endsWith('.html'))
          .map(dirent => dirent.name.replace('.html', ''));
        console.log(`Found ${generatedBlogPostIds.length} generated blog post pages`);
      } catch (err) {
        console.error('Error scanning blog directory:', err);
      }
    }
    
    // Create updated sitemap entries for all main routes
    const mainRouteUrls = routes.map(route => ({
      path: route,
      priority: route === '/' ? '1.0' : '0.8',
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0],
      hreflang: `  <xhtml:link rel="alternate" hreflang="en" href="${SEO_DOMAIN}${route}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SEO_DOMAIN}${route}" />`
    }));
    
    // Create updated sitemap entries for cats based on actually generated pages
    const updatedCatUrls = generatedCatIds.map(id => ({
      path: `/cats/${id}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0],
      hreflang: `  <xhtml:link rel="alternate" hreflang="en" href="${SEO_DOMAIN}/cats/${id}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SEO_DOMAIN}/cats/${id}" />`
    }));
    
    // Create updated sitemap entries for lost & found based on actually generated pages
    const updatedLostFoundUrls = generatedLostFoundIds.map(id => ({
      path: `/lost-found/${id}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0],
      hreflang: `  <xhtml:link rel="alternate" hreflang="en" href="${SEO_DOMAIN}/lost-found/${id}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SEO_DOMAIN}/lost-found/${id}" />`
    }));
    
    // Create updated sitemap entries for success stories based on actually generated pages
    const updatedSuccessStoryUrls = generatedSuccessStoryIds.map(id => ({
      path: `/success-stories/${id}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0],
      hreflang: `  <xhtml:link rel="alternate" hreflang="en" href="${SEO_DOMAIN}/success-stories/${id}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SEO_DOMAIN}/success-stories/${id}" />`
    }));
    
    // Create updated sitemap entries for blog posts based on actually generated pages
    const updatedBlogPostUrls = generatedBlogPostIds.map(id => ({
      path: `/blog/${id}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0],
      hreflang: `  <xhtml:link rel="alternate" hreflang="en" href="${SEO_DOMAIN}/blog/${id}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SEO_DOMAIN}/blog/${id}" />`
    }));
    
    // Create updated sitemap entries for events based on actually generated pages
    const updatedEventUrls = generatedEventIds.map(id => ({
      path: `/events/${id}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0],
      hreflang: `  <xhtml:link rel="alternate" hreflang="en" href="${SEO_DOMAIN}/events/${id}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SEO_DOMAIN}/events/${id}" />`
    }));
    
    // Combine all routes for updated sitemap
    const allFinalRoutes = [
      ...mainRouteUrls,
      ...updatedBlogPostUrls,
      ...updatedCatUrls,
      ...updatedEventUrls,
      ...updatedLostFoundUrls, 
      ...updatedSuccessStoryUrls,
      ...applyRoutes.map(route => ({
        path: route.path,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0],
        hreflang: `  <xhtml:link rel="alternate" hreflang="en" href="${SEO_DOMAIN}${route.path}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SEO_DOMAIN}${route.path}" />`
      }))
    ];
    
    console.log(`\nSitemap will include:`);
    console.log(`- ${routes.length} main routes`);
    console.log(`- ${updatedBlogPostUrls.length} blog posts`);
    console.log(`- ${updatedCatUrls.length} cat listings`);
    console.log(`- ${updatedEventUrls.length} events`);
    console.log(`- ${updatedLostFoundUrls.length} lost & found listings`);
    console.log(`- ${updatedSuccessStoryUrls.length} success stories`);
    console.log(`- ${applyRoutes.length} application pages`);
    console.log(`- ${allFinalRoutes.length} total URLs`);
    
    // Create a new, final sitemap.xml with all generated pages
    const finalSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allFinalRoutes.map(route => {
  const loc = `${SEO_DOMAIN}${route.path === '/' ? '' : route.path}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${route.hreflang}
  </url>`;
}).join('\n')}
</urlset>`;
    
    writeFileSync(join(outDir, 'sitemap.xml'), finalSitemapContent);
    console.log('Generated final enhanced sitemap.xml with ALL entity pages!');
    
    // Create a robots.txt with improved directives
    const robotsContent = `# Meow Rescue Robots.txt
User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin*
Disallow: /login
Disallow: /dashboard

# Sitemap
Sitemap: ${SEO_DOMAIN}/sitemap.xml
`;
    writeFileSync(join(outDir, 'robots.txt'), robotsContent);
    console.log('Generated enhanced robots.txt');
    
    // Clean up empty directories
    function isDirectoryEmpty(directoryPath) {
      try {
        const files = readdirSync(directoryPath);
        return files.length === 0;
      } catch (error) {
        console.error(`Error checking if directory is empty: ${directoryPath}`, error);
        return false;
      }
    }
    
    function removeEmptyDirectories(directoryPath) {
      try {
        const entries = readdirSync(directoryPath, { withFileTypes: true });
        
        // Process subdirectories first
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const fullPath = join(directoryPath, entry.name);
            removeEmptyDirectories(fullPath);
          }
        }
        
        // Check if this directory is now empty (after processing subdirectories)
        if (isDirectoryEmpty(directoryPath)) {
          // Skip removing important directories like assets, server, blog, cats, etc.
          const importantDirs = ['assets', 'server', 'blog', 'cats', 'lost-found', 'success-stories'];
          const dirName = basename(directoryPath);
          
          if (!importantDirs.includes(dirName)) {
            console.log(`Removing empty directory: ${directoryPath}`);
            rmdirSync(directoryPath);
          }
        }
      } catch (error) {
        console.error(`Error removing empty directory: ${directoryPath}`, error);
      }
    }
    
    // Remove empty directories
    console.log('Cleaning up empty directories...');
    removeEmptyDirectories(outDir);
    console.log('Empty directory cleanup complete.');
  } catch (err) {
    console.error('Fatal error during prerendering:', err);
    process.exit(1);
  }
}

// Run the function
generateStaticFiles().catch(error => {
  console.error('Fatal error during prerendering:', error);
  process.exit(1);
});
