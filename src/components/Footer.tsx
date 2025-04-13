
import React from 'react';
import { Link } from 'react-router-dom';
import { Cat, Heart, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-meow-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white rounded-full p-1.5">
                <Cat className="w-6 h-6 text-meow-primary" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Meow</span>
                <span className="text-xl font-bold text-meow-secondary">Rescue</span>
              </div>
            </div>
            <p className="text-gray-200 text-sm mb-6">
              A home-based cat rescue dedicated to saving cats and kittens in need throughout Pasco County, Florida.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" className="hover:text-meow-secondary transition-colors" target="_blank" rel="noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="hover:text-meow-secondary transition-colors" target="_blank" rel="noreferrer">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-meow-secondary transition-colors" target="_blank" rel="noreferrer">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-200 hover:text-meow-secondary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/cats" className="text-gray-200 hover:text-meow-secondary transition-colors">Adoptable Cats</Link>
              </li>
              <li>
                <Link to="/adopt" className="text-gray-200 hover:text-meow-secondary transition-colors">Adoption Process</Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-200 hover:text-meow-secondary transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-gray-200 hover:text-meow-secondary transition-colors">Volunteer</Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-200 hover:text-meow-secondary transition-colors">Resources</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-meow-secondary shrink-0 mt-0.5" />
                <a 
                  href="https://www.google.com/maps/place/New+Port+Richey,+FL/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-200 hover:text-meow-secondary transition-colors"
                >
                  New Port Richey / Pasco County, Florida
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-meow-secondary shrink-0" />
                <a href="tel:7272570037" className="text-gray-200 hover:text-meow-secondary transition-colors">
                  (727) 257-0037
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-meow-secondary shrink-0" />
                <a href="mailto:info@meowrescue.org" className="text-gray-200 hover:text-meow-secondary transition-colors">
                  info@meowrescue.org
                </a>
              </li>
            </ul>
          </div>
          
          {/* Get Involved */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Get Involved</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/donate" className="flex items-center space-x-2 text-gray-200 hover:text-meow-secondary transition-colors">
                  <Heart className="w-5 h-5 text-meow-secondary" />
                  <span>Donate</span>
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="flex items-center space-x-2 text-gray-200 hover:text-meow-secondary transition-colors">
                  <Heart className="w-5 h-5 text-meow-secondary" />
                  <span>Volunteer</span>
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="flex items-center space-x-2 text-gray-200 hover:text-meow-secondary transition-colors">
                  <Heart className="w-5 h-5 text-meow-secondary" />
                  <span>Foster</span>
                </Link>
              </li>
              <li>
                <Link to="/subscribe" className="flex items-center space-x-2 text-gray-200 hover:text-meow-secondary transition-colors">
                  <Heart className="w-5 h-5 text-meow-secondary" />
                  <span>Subscribe</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300 text-sm">
          <div className="mb-4">
            <Link to="/privacy-policy" className="hover:text-meow-secondary mx-3">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-meow-secondary mx-3">Terms of Service</Link>
          </div>
          <p>
            &copy; {currentYear} Meow Rescue. All rights reserved. Meow Rescue is a 501(c)(3) nonprofit organization. EIN: XX-XXXXXXX
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
