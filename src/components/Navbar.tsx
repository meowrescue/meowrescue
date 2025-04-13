
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, Users, Home, Info, Calendar, BookOpen, Phone, Cat, LogOut, User, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
            <div className="bg-meow-primary rounded-full p-1.5">
              <Cat className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-meow-primary">Meow</span>
              <span className="text-xl font-bold text-meow-secondary">Rescue</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={<Home size={16} />} onClick={handleLinkClick}>Home</NavLink>
            <NavLink to="/about" icon={<Info size={16} />} onClick={handleLinkClick}>About Us</NavLink>
            <NavLink to="/cats" icon={<Heart size={16} />} onClick={handleLinkClick}>Adoptable Cats</NavLink>
            <NavLink to="/adopt" icon={<Users size={16} />} onClick={handleLinkClick}>Adopt</NavLink>
            <NavLink to="/events" icon={<Calendar size={16} />} onClick={handleLinkClick}>Events</NavLink>
            <NavLink to="/lost-found" icon={<Search size={16} />} onClick={handleLinkClick}>Lost & Found</NavLink>
            <NavLink to="/resources" icon={<BookOpen size={16} />} onClick={handleLinkClick}>Resources</NavLink>
            <NavLink to="/contact" icon={<Phone size={16} />} onClick={handleLinkClick}>Contact</NavLink>
          </nav>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <Button asChild variant="outline" className="hover:bg-meow-primary/10 hover:text-meow-primary">
                  <Link to="/profile" onClick={handleLinkClick}>
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="hover:bg-meow-primary/10 hover:text-meow-primary"
                  onClick={signOut}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" className="hover:bg-meow-primary/10 hover:text-meow-primary">
                <Link to="/login" onClick={handleLinkClick}>Login</Link>
              </Button>
            )}
            <Button asChild className="bg-meow-secondary hover:bg-meow-secondary/90 text-white">
              <Link to="/donate" onClick={handleLinkClick}>Donate Now</Link>
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
            <MobileNavLink to="/" icon={<Home size={18} />} onClick={handleLinkClick}>Home</MobileNavLink>
            <MobileNavLink to="/about" icon={<Info size={18} />} onClick={handleLinkClick}>About Us</MobileNavLink>
            <MobileNavLink to="/cats" icon={<Heart size={18} />} onClick={handleLinkClick}>Adoptable Cats</MobileNavLink>
            <MobileNavLink to="/adopt" icon={<Users size={18} />} onClick={handleLinkClick}>Adopt</MobileNavLink>
            <MobileNavLink to="/events" icon={<Calendar size={18} />} onClick={handleLinkClick}>Events</MobileNavLink>
            <MobileNavLink to="/lost-found" icon={<Search size={18} />} onClick={handleLinkClick}>Lost & Found</MobileNavLink>
            <MobileNavLink to="/resources" icon={<BookOpen size={18} />} onClick={handleLinkClick}>Resources</MobileNavLink>
            <MobileNavLink to="/contact" icon={<Phone size={18} />} onClick={handleLinkClick}>Contact</MobileNavLink>
            
            {user ? (
              <>
                <MobileNavLink to="/profile" icon={<User size={18} />} onClick={handleLinkClick}>Profile</MobileNavLink>
                <div 
                  className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                  onClick={() => {
                    signOut();
                    handleLinkClick();
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </div>
              </>
            ) : (
              <MobileNavLink to="/login" icon={<User size={18} />} onClick={handleLinkClick}>Login</MobileNavLink>
            )}
            
            <div className="pt-2">
              <Button asChild className="w-full bg-meow-secondary hover:bg-meow-secondary/90 text-white">
                <Link to="/donate" onClick={handleLinkClick}>Donate Now</Link>
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
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, icon, onClick }) => {
  return (
    <Link 
      to={to} 
      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-1 transition-colors"
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </Link>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ to, children, icon, onClick }) => {
  return (
    <Link 
      to={to} 
      className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </Link>
  );
};

export default Navbar;
