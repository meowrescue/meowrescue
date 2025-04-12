
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, Users, Home, Info, Calendar, BookOpen, Phone } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-meow-primary rounded-full p-1.5">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14C8.5 14.5 9.5 15 12 15C14.5 15 15.5 14.5 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9.5C9 8.67157 8.32843 8 7.5 8C6.67157 8 6 8.67157 6 9.5C6 10.3284 6.67157 11 7.5 11C8.32843 11 9 10.3284 9 9.5Z" fill="currentColor"/>
                <path d="M18 9.5C18 8.67157 17.3284 8 16.5 8C15.6716 8 15 8.67157 15 9.5C15 10.3284 15.6716 11 16.5 11C17.3284 11 18 10.3284 18 9.5Z" fill="currentColor"/>
                <path d="M7.5 16.5L5.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 16.5L18.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-meow-primary">Meow</span>
              <span className="text-xl font-bold text-meow-secondary">Rescue</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={<Home size={16} />}>Home</NavLink>
            <NavLink to="/about" icon={<Info size={16} />}>About Us</NavLink>
            <NavLink to="/cats" icon={<Heart size={16} />}>Adoptable Cats</NavLink>
            <NavLink to="/adopt" icon={<Users size={16} />}>Adopt</NavLink>
            <NavLink to="/events" icon={<Calendar size={16} />}>Events</NavLink>
            <NavLink to="/resources" icon={<BookOpen size={16} />}>Resources</NavLink>
            <NavLink to="/contact" icon={<Phone size={16} />}>Contact</NavLink>
          </nav>
          
          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-meow-secondary hover:bg-meow-secondary/90 text-white">
              Donate Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4 animate-fade-in">
          <nav className="flex flex-col space-y-3">
            <MobileNavLink to="/" icon={<Home size={18} />}>Home</MobileNavLink>
            <MobileNavLink to="/about" icon={<Info size={18} />}>About Us</MobileNavLink>
            <MobileNavLink to="/cats" icon={<Heart size={18} />}>Adoptable Cats</MobileNavLink>
            <MobileNavLink to="/adopt" icon={<Users size={18} />}>Adopt</MobileNavLink>
            <MobileNavLink to="/events" icon={<Calendar size={18} />}>Events</MobileNavLink>
            <MobileNavLink to="/resources" icon={<BookOpen size={18} />}>Resources</MobileNavLink>
            <MobileNavLink to="/contact" icon={<Phone size={18} />}>Contact</MobileNavLink>
            <div className="pt-2">
              <Button className="w-full bg-meow-secondary hover:bg-meow-secondary/90 text-white">
                Donate Now
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, icon }) => {
  return (
    <Link 
      to={to} 
      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-1 transition-colors"
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </Link>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ to, children, icon }) => {
  return (
    <Link 
      to={to} 
      className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </Link>
  );
};

export default Navbar;
