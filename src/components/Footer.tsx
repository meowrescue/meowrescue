
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-meow-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Meow Rescue</h3>
            <p className="text-sm mb-4">
              Meow Rescue is a home-based cat rescue in New Port Richey, Florida. 
              We're dedicated to saving local lives, one paw at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-meow-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-meow-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-meow-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-meow-accent transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/cats" className="hover:text-meow-accent transition-colors">Adoptable Cats</Link>
              </li>
              <li>
                <Link to="/adopt" className="hover:text-meow-accent transition-colors">Adoption Process</Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-meow-accent transition-colors">Donate</Link>
              </li>
              <li>
                <Link to="/volunteer" className="hover:text-meow-accent transition-colors">Volunteer/Foster</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>New Port Richey, Pasco County, Florida (Moon Lake vicinity)</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <a href="mailto:info@meowrescue.org" className="hover:text-meow-accent transition-colors">
                  info@meowrescue.org
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-meow-accent transition-colors">
                  (123) 456-7890
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm mb-3">
              Subscribe to our newsletter for updates on adoptable cats, events, and rescue news.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-3 py-2 rounded text-sm text-black"
              />
              <button type="submit" className="bg-meow-secondary hover:bg-meow-secondary/90 px-3 py-2 rounded text-sm font-medium transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-white/20 mt-8 pt-6 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {currentYear} Meow Rescue. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-meow-accent transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-meow-accent transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
