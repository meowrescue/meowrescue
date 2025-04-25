
export const SEO_DOMAIN = "https://meowrescue.org";

export const defaultMetaTags = {
  title: 'MeowRescue - Cat Adoption & Foster Care',
  description: 'MeowRescue is a home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need.'
};

export const getBaseUrl = () => {
  if (process.env.DEPLOY_URL || process.env.NETLIFY_URL || process.env.URL) {
    return process.env.DEPLOY_URL || process.env.NETLIFY_URL || process.env.URL;
  }
  if (process.env.CUSTOM_DOMAIN) {
    return process.env.CUSTOM_DOMAIN.startsWith('http') 
      ? process.env.CUSTOM_DOMAIN 
      : `https://${process.env.CUSTOM_DOMAIN}`;
  }
  return '';
};

export const navLinks = [
  { title: 'Home', url: '/' },
  { title: 'About', url: '/about' },
  { title: 'Adoptable Cats', url: '/cats' },
  { title: 'Adopt', url: '/adopt' },
  { title: 'Volunteer', url: '/volunteer' },
  { title: 'Foster', url: '/foster' },
  { title: 'Donate', url: '/donate' },
  { title: 'Events', url: '/events' },
  { title: 'Blog', url: '/blog' },
  { title: 'Lost & Found', url: '/lost-found' },
  { title: 'Resources', url: '/resources' },
  { title: 'Success Stories', url: '/success-stories' },
  { title: 'Contact', url: '/contact' },
  { title: 'Privacy Policy', url: '/privacy-policy' },
  { title: 'Terms of Service', url: '/terms-of-service' }
];
