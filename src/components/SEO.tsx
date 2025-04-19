
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
  // Add missing properties
  type?: string;
  image?: string;
  canonicalUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: any; // Using any for flexibility with structured data objects
}

const SEO: React.FC<SEOProps> = ({
  title = 'Meow Rescue | Cat Rescue and Adoption',
  description = 'Meow Rescue is dedicated to rescuing, rehabilitating, and finding forever homes for cats in need throughout Pasco County, Florida.',
  keywords = 'cat rescue, cat adoption, pet adoption, animal shelter, Florida, Pasco County',
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  ogUrl = 'https://meowrescue.org',
  twitterCard = 'summary_large_image',
  image,
  canonicalUrl,
  publishedTime,
  modifiedTime,
  structuredData,
  type,
}) => {
  const siteTitle = title.includes('Meow Rescue') ? title : `${title} | Meow Rescue`;
  
  // Use image prop if provided, otherwise fall back to ogImage
  const finalImage = image || ogImage;
  // Use canonicalUrl if provided, otherwise fall back to ogUrl
  const finalUrl = canonicalUrl ? `https://meowrescue.org${canonicalUrl}` : ogUrl;
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={finalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:type" content={type || ogType} />
      <meta property="og:url" content={finalUrl} />
      
      {/* Article specific Open Graph tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      
      {/* Structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
