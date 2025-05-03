import getSupabaseClient from '@/integrations/supabase/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
  children?: React.ReactNode;
  structuredData?: Record<string, any> | Record<string, any>[];
  noindex?: boolean;
  nextUrl?: string;
  prevUrl?: string;
  alternateLanguages?: { lang: string; url: string }[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = "MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need.",
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime = "2025-04-21T12:00:00Z",
  canonicalUrl,
  structuredData,
  noindex = false,
  nextUrl,
  prevUrl,
  alternateLanguages,
  children
}) => {
  // Always use production domain for SEO
  const SEO_DOMAIN = "https://meowrescue.org";

  // Build URLs with production domain
  const buildFullUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${SEO_DOMAIN}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const fullCanonicalUrl = canonicalUrl
    ? (canonicalUrl.startsWith('http') ? canonicalUrl : buildFullUrl(canonicalUrl))
    : (url ? buildFullUrl(url) : SEO_DOMAIN);

  // Default image (production)
  const defaultImage = `${SEO_DOMAIN}/images/meow-rescue-logo.jpg`;

  // Convert single structuredData to array if it's not already
  const structuredDataArray = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  // Add WebSite schema if it's the homepage and not already included
  if ((url === '/' || !url) && !structuredDataArray.some(data => data['@type'] === 'WebSite')) {
    structuredDataArray.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Meow Rescue",
      "url": SEO_DOMAIN,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SEO_DOMAIN}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "description": description,
      "dateModified": modifiedTime
    });
  }

  structuredDataArray.forEach(schema => {
    if (!schema.dateModified) {
      schema.dateModified = modifiedTime;
    }
  });

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index,follow" />}

      {/* Canonical URL (absolute) */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Pagination links */}
      {nextUrl && <link rel="next" href={nextUrl.startsWith('http') ? nextUrl : buildFullUrl(nextUrl)} />}
      {prevUrl && <link rel="prev" href={prevUrl.startsWith('http') ? prevUrl : buildFullUrl(prevUrl)} />}

      {/* Alternate language versions (absolute) */}
      {alternateLanguages && alternateLanguages.map((alt) => (
        <link
          key={alt.lang}
          rel="alternate"
          hrefLang={alt.lang}
          href={alt.url.startsWith('http') ? alt.url : buildFullUrl(alt.url)}
        />
      ))}
      {alternateLanguages && <link rel="alternate" hrefLang="x-default" href={SEO_DOMAIN} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url ? buildFullUrl(url) : SEO_DOMAIN} />
      <meta property="og:site_name" content="Meow Rescue" />

      {/* Content freshness indicators */}
      <meta property="og:updated_time" content={modifiedTime} />
      <meta name="last-modified" content={modifiedTime} />
      <meta http-equiv="last-modified" content={modifiedTime} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Article-specific Meta Tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Structured Data JSON-LD */}
      {structuredDataArray.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}

      {/* Preconnects */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />

      {/* Sitemap link (absolute url) */}
      <link rel="sitemap" type="application/xml" href={`${SEO_DOMAIN}/sitemap.xml`} />

      {/* Content Security Policy */}
      <meta 
        http-equiv="Content-Security-Policy" 
        content="
          default-src 'self'; 
          script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
          img-src 'self' https://sfrlnidbiviniuqhryyc.supabase.co data:; 
          font-src 'self' https://fonts.gstatic.com; 
          connect-src 'self' https://sfrlnidbiviniuqhryyc.supabase.co; 
          frame-src 'self' https://sfrlnidbiviniuqhryyc.supabase.co;
        " 
      />

      {children}
    </Helmet>
  );
};

export default SEO;
