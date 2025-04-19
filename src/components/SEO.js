
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
}

const SEO: React.FC<SEOProps> = ({
  title = 'Meow Rescue | Cat Rescue and Adoption',
  description = 'Meow Rescue is dedicated to rescuing, rehabilitating, and finding forever homes for cats in need throughout Pasco County, Florida.',
  keywords = 'cat rescue, cat adoption, pet adoption, animal shelter, Florida, Pasco County',
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  ogUrl = 'https://meowrescue.org',
  twitterCard = 'summary_large_image',
}) => {
  const siteTitle = title.includes('Meow Rescue') ? title : `${title} | Meow Rescue`;
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
