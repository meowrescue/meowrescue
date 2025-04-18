
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
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  canonicalUrl,
  structuredData,
  noindex = false,
  children
}) => {
  const siteUrl = 'https://meowrescue.org';
  const defaultImage = `${siteUrl}/images/meow-rescue-logo.jpg`;
  const fullCanonicalUrl = canonicalUrl ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${siteUrl}${canonicalUrl}`) : url;
  
  // Convert single structuredData to array if it's not already
  const structuredDataArray = structuredData 
    ? Array.isArray(structuredData) 
      ? structuredData 
      : [structuredData] 
    : [];
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Prevent indexing if specified */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:site_name" content="Meow Rescue" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Article-specific Meta Tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      
      {/* Content Freshness for SEO */}
      {modifiedTime && (
        <>
          <meta name="last-modified" content={modifiedTime} />
          <meta property="og:updated_time" content={modifiedTime} />
          <meta http-equiv="last-modified" content={modifiedTime} />
        </>
      )}
      
      {/* Structured Data JSON-LD */}
      {structuredDataArray.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
      
      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {children}
    </Helmet>
  );
};

export default SEO;
