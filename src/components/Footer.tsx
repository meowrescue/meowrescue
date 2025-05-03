import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cat, Heart, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { scrollToTop } from '@/utils/scrollUtils';
import getSupabaseClient from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const [licenseInfo, setLicenseInfo] = useState<{ license_number: string; issue_date?: string } | null>(null);
  const currentYear = new Date().getFullYear();

  // Quick links in two columns
  const quickLinksColumnOne = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/cats", label: "Adoptable Cats" },
    { path: "/adopt", label: "Adoption Process" },
    { path: "/success-stories", label: "Success Stories" },
    { path: "/volunteer", label: "Volunteer" },
  ];
  
  // Add Financial Transparency if not present:
  const quickLinksColumnTwo = [
    { path: "/foster", label: "Foster" },
    { path: "/donate", label: "Donate" },
    { path: "/events", label: "Events" },
    { path: "/blog", label: "Blog" },
    { path: "/lost-found", label: "Lost & Found" },
    { path: "/financial-transparency", label: "Financial Transparency" },
    { path: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const fetchLicenseInfo = async () => {
      try {
        const supabaseClient = getSupabaseClient();
        const { data, error } = await supabaseClient
          .from('business_licenses')
          .select('license_number, issue_date')
          .eq('license_type', 'Business License')
          .limit(1); // Fetch at most one record
        
        // Check if data is an array and has at least one element
        if (!error && data && data.length > 0) {
          setLicenseInfo(data[0]); // Use the first license found
        } else {
          // Use default license info if no matching license found or there's an error
          if (error && error.code !== 'PGRST116') { // PGRST116: 'Exact one row expected' - ignore this if we removed .single()
            console.warn('Error fetching license info:', error.message);
          }
          setLicenseInfo({
            license_number: 'MR-2023-001',
            issue_date: '2023-01-15'
          });
        }
      } catch (err) {
        // Fallback to default license info
        setLicenseInfo({
          license_number: 'MR-2023-001',
          issue_date: '2023-01-15'
        });
      }
    };

    fetchLicenseInfo();
  }, []);

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <Link to="/" className="inline-flex items-center mb-4" onClick={scrollToTop}>
              <div className="bg-white rounded-full p-2 mr-2">
                <Cat className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">Meow</span>
                <span className="text-accent">Rescue</span>
              </span>
            </Link>
            <p className="mb-4 text-white/80">
              A home-based cat rescue in Pasco County, Florida, dedicated to rescuing, rehabilitating, and rehoming cats in need.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-white" />
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
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-accent" />
                <a href="tel:7272570037" className="text-white/80 hover:text-white transition-colors">
                  (727) 257-0037
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-accent" />
                <a href="mailto:info@meowrescue.org" className="text-white/80 hover:text-white transition-colors">
                  info@meowrescue.org
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Support Our Mission</h4>
              <Link to="/donate" onClick={scrollToTop}>
                <Button variant="meowSecondary" size="sm" className="flex items-center">
                  <Heart className="mr-1 h-4 w-4" />
                  <span>Donate Now</span>
                </Button>
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
                  <span className="block text-sm">
                    License #: {licenseInfo.license_number}
                    {licenseInfo.issue_date && (
                      <> • Issued: {new Date(licenseInfo.issue_date).toLocaleDateString()}</>
                    )}
                  </span>
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
