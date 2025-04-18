import { supabase } from '@/integrations/supabase/client';
import fs from 'fs';
import path from 'path';

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSitemap(outputPath: string): Promise<void> {
  try {
    const baseUrl = 'https://meowrescue.org';
    const entries: SitemapEntry[] = [
      { url: '/', lastmod: new Date() .toISOString().split('T')[0], changefreq: 'weekly', priority: 1.0 },
      { url: '/about', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
      { url: '/cats', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.9 },
      { url: '/adopt', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
      { url: '/volunteer', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.7 },
      { url: '/foster', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.7 },
      { url: '/donate', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.7 },
      { url: '/events', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: 0.7 },
      { url: '/blog', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: 0.8 },
      { url: '/resources', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.6 },
      { url: '/lost-found', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.8 },
      { url: '/contact', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.7 },
      { url: '/success-stories', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: 0.6 },
    ];

    // Add dynamic cat pages
    const { data: cats, error: catsError } = await supabase
      .from('cats')
      .select('id, updated_at')
      .eq('is_published', true);

    if (catsError) {
      console.error('Error fetching cats for sitemap:', catsError);
    } else if (cats) {
      for (const cat of cats) {
        entries.push({
          url: `/cats/${cat.id}`,
          lastmod: cat.updated_at ? new Date(cat.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: 0.8
        });
      }
    }

    // Add dynamic blog posts
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('is_published', true);

    if (postsError) {
      console.error('Error fetching blog posts for sitemap:', postsError);
    } else if (posts) {
      for (const post of posts) {
        entries.push({
          url: `/blog/${post.slug}`,
          lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: 0.7
        });
      }
    }

    // Generate XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const entry of entries)  {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${entry.url}</loc>\n`;
      if (entry.lastmod) {
        xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      }
      if (entry.changefreq) {
        xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      }
      if (entry.priority !== undefined) {
        xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
      }
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(outputPath, xml);
    console.log(`Sitemap generated at ${outputPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}
