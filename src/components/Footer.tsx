import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cat, Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { scrollToTop } from '@/utils/scrollUtils';
import { supabase } from '@/integrations/supabase/client';

const Footer: React.FC = () => {
  const [licenseInfo, setLicenseInfo] = useState<{ license_number: string } | null>(null);
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toISOString(); // For SEO content freshness

  // Quick links in two columns
  const quickLinksColumnOne = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/cats", label: "Available Cats" },
    { path: "/adopt", label: "Adoption Process" },
    { path: "/success-stories", label: "Success Stories" },
    { path: "/volunteer", label: "Volunteer" },
  ];
  
  const quickLinksColumnTwo = [
    { path: "/foster", label: "Foster" },
    { path: "/donate", label: "Donate" },
    { path: "/events", label: "Events" },
    { path: "/blog", label: "Blog" },
    { path: "/lost-found", label: "Lost & Found" },
    { path: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const fetchLicenseInfo = async () => {
      const { data, error } = await supabase
        .from('business_licenses')
        .select('license_number')
        .eq('license_type', 'Business License')
        .single();
      
      if (data && !error) {
        setLicenseInfo(data);
      }
    };

    fetchLicenseInfo();
  }, []);

  return (
    <footer className="bg-meow-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white rounded-full p-2 mr-2">
                <Cat className="h-6 w-6 text-meow-primary" />
              </div>
              <h3 className="text-xl font-bold">
                <span className="text-white">Meow</span>
                <span className="text-meow-secondary">Rescue</span>
              </h3>
            </div>
            <p className="mb-4 text-white/80">
              A home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links Section - Two columns */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* First column of links */}
              <ul className="space-y-2">
                {quickLinksColumnOne.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-white/80 hover:text-white transition-colors"
                      onClick={scrollToTop}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Second column of links */}
              <ul className="space-y-2">
                {quickLinksColumnTwo.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-white/80 hover:text-white transition-colors"
                      onClick={scrollToTop}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-meow-secondary" />
                <a 
                  href="https://maps.google.com/?q=7726+US+Highway+19,New+Port+Richey,FL+34652" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  7726 US Highway 19<br />
                  New Port Richey, FL 34652
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-meow-secondary" />
                <a href="tel:7272570037" className="text-white/80 hover:text-white transition-colors">
                  (727) 257-0037
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-meow-secondary" />
                <a href="mailto:info@meowrescue.org" className="text-white/80 hover:text-white transition-colors">
                  info@meowrescue.org
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Support Our Mission</h4>
              <Link to="/donate" onClick={scrollToTop}>
                <button className="bg-meow-secondary px-4 py-2 rounded flex items-center text-white hover:bg-meow-secondary/90 transition-colors">
                  <Heart className="h-5 w-5 mr-2" />
                  <span>Donate Now</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left space-y-2">
              <p className="text-white/80">
                &copy; {currentYear} Meow Rescue Network, Inc.
                <span className="block text-sm">DBA: Meow Rescue</span>
                {licenseInfo && (
                  <span className="block text-sm">License #: {licenseInfo.license_number}</span>
                )}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link to="/privacy-policy" onClick={scrollToTop} className="text-white/80 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" onClick={scrollToTop} className="text-white/80 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
