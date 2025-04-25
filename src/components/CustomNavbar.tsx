import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Heart, 
  UserCircle,
  LogIn,
  Cat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NavbarLogo from './NavbarLogo';
import NavbarUserMenu from './NavbarUserMenu';
import NavbarRightSection from './NavbarRightSection';
import NavbarMobileMenu from './NavbarMobileMenu';

const navLinks = [
  { 
    name: 'Adopt', 
    path: '/cats',
    id: 'adopt-dropdown',
    dropdown: [
      { name: 'Adoptable Cats', path: '/cats' },
      { name: 'Adoption Process', path: '/adopt' },
      { name: 'Success Stories', path: '/success-stories' },
    ]
  },
  { 
    name: 'Get Involved', 
    path: '/volunteer',
    id: 'involve-dropdown',
    dropdown: [
      { name: 'Volunteer', path: '/volunteer' },
      { name: 'Foster', path: '/foster' },
      { name: 'Donate', path: '/donate' },
    ]
  },
  { 
    name: 'Resources', 
    path: '/resources',
    id: 'resources-dropdown',
    dropdown: [
      { name: 'Cat Care Tips', path: '/resources' },
      { name: 'Lost & Found', path: '/lost-found' },
      { name: 'Financial Transparency', path: '/financial-transparency' },
    ]
  },
  { name: 'Events', path: '/events' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const CustomNavbar: React.FC = () => {
  // Assume useAuth and isMobile/scroll logic is handled elsewhere if needed
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.first_name && !user?.last_name) return 'U';
    
    const firstInitial = user?.first_name ? user.first_name.charAt(0) : '';
    const lastInitial = user?.last_name ? user.last_name.charAt(0) : '';
    
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 mr-4">
            <NavbarLogo />
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center px-8">
            <ul className="flex items-center">
              {navLinks.map((link) => (
                <li key={link.path} className="relative -ml-[1px]">
                  {link.dropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className={`inline-flex items-center whitespace-nowrap gap-1 px-2 py-1 font-medium transition-colors hover:text-meow-primary ${
                          isActive(link.path) ? 'text-meow-primary' : 'text-gray-700'
                        }`}>
                          <span>{link.name}</span>
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-48">
                        {link.dropdown.map((item) => (
                          <DropdownMenuItem key={item.path} asChild>
                            <Link
                              to={item.path}
                              className={`px-4 py-2 ${isActive(item.path) ? 'text-meow-primary' : ''}`}
                            >
                              {item.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      to={link.path}
                      className={`px-2 py-1 font-medium transition-colors hover:text-meow-primary whitespace-nowrap ${
                        isActive(link.path) ? 'text-meow-primary' : 'text-gray-700'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* Right Side */}
          <NavbarRightSection
            user={user}
            signOut={signOut}
            getUserInitials={getUserInitials}
            isMenuOpen={isMenuOpen}
            onMobileToggle={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
      </div>
      {/* Mobile Menu */}
      <NavbarMobileMenu
        isMenuOpen={isMenuOpen}
        navLinks={navLinks}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
};

export default CustomNavbar;
