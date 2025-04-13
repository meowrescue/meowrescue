
import React from 'react';
import { Link } from 'react-router-dom';
import { Cat, Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toISOString(); // For SEO content freshness

  return (
    <footer className="bg-meow-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/cats" className="text-white/80 hover:text-white transition-colors">Available Cats</Link>
              </li>
              <li>
                <Link to="/adopt" className="text-white/80 hover:text-white transition-colors">Adoption Process</Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-white/80 hover:text-white transition-colors">Success Stories</Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-white/80 hover:text-white transition-colors">Volunteer</Link>
              </li>
              <li>
                <Link to="/foster" className="text-white/80 hover:text-white transition-colors">Foster</Link>
              </li>
              <li>
                <Link to="/donate" className="text-white/80 hover:text-white transition-colors">Donate</Link>
              </li>
              <li>
                <Link to="/events" className="text-white/80 hover:text-white transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/80 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/lost-found" className="text-white/80 hover:text-white transition-colors">Lost & Found</Link>
              </li>
              <li>
                <Link to="/resources" className="text-white/80 hover:text-white transition-colors">Resources</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-meow-secondary" />
                <span className="text-white/80">
                  7726 US Highway 19<br />
                  New Port Richey, FL 34652
                </span>
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
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Support Our Mission</h3>
            <p className="text-white/80 mb-4">
              Your donations help us save more cats and provide them with the medical care, food, and love they need.
            </p>
            <Link to="/donate">
              <button className="bg-meow-secondary px-4 py-2 rounded flex items-center text-white hover:bg-meow-secondary/90 transition-colors">
                <Heart className="h-5 w-5 mr-2" />
                <span>Donate Now</span>
              </button>
            </Link>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-white/80">
                &copy; {currentYear} Meow Rescue. All rights reserved.
              </p>
              <p className="text-white/60 text-sm">
                <time dateTime={lastUpdated}>Last Updated: {new Date(lastUpdated).toLocaleDateString()}</time>
              </p>
            </div>
            <div className="flex space-x-4">
              <Link to="/privacy-policy" className="text-white/80 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-white/80 hover:text-white transition-colors">
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
