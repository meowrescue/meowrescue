
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Meow Rescue - Cat Adoption & Rescue',
  description = 'Meow Rescue is a home-based cat rescue in New Port Richey, Florida, dedicated to saving and rehoming cats in need. Adopt, donate, foster, or volunteer today.',
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://lovable.dev/opengraph-image-p98pqg.png',
}) => {
  const siteTitle = title.includes('Meow Rescue') ? title : `${title} | Meow Rescue`;
  
  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SEO;
