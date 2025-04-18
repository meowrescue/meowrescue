import React, { useState, useEffect } from 'react';
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

const CustomNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

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

  const isActive = (path: string) => location.pathname === path;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.first_name && !user?.last_name) return 'U';
    
    const firstInitial = user?.first_name ? user.first_name.charAt(0) : '';
    const lastInitial = user?.last_name ? user.last_name.charAt(0) : '';
    
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Main navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { 
      name: 'Adopt', 
      path: '/cats',
      dropdown: [
        { name: 'Adoptable Cats', path: '/cats' },
        { name: 'Adoption Process', path: '/adopt' },
        { name: 'Success Stories', path: '/success-stories' },
      ]
    },
    { 
      name: 'Get Involved', 
      path: '/volunteer',
      dropdown: [
        { name: 'Volunteer', path: '/volunteer' },
        { name: 'Foster', path: '/foster' },
        { name: 'Donate', path: '/donate' },
      ]
    },
    { 
      name: 'Resources', 
      path: '/resources',
      dropdown: [
        { name: 'Cat Care Tips', path: '/resources' },
        { name: 'Lost & Found', path: '/lost-found' },
      ]
    },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/90'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - making sure it's identical to admin sidebar */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-meow-primary rounded-full p-1">
              <Cat className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-meow-primary">Meow</span>
              <span className="text-meow-secondary">Rescue</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.path} className="relative">
                  {link.dropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className={`inline-flex items-center gap-1 font-medium transition-colors hover:text-meow-primary ${
                          isActive(link.path) ? 'text-meow-primary' : 'text-gray-700'
                        }`}>
                          <span>{link.name}</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-48">
                        {link.dropdown.map((item) => (
                          <DropdownMenuItem key={item.path} asChild>
                            <Link
                              to={item.path}
                              className={isActive(item.path) ? 'text-meow-primary' : ''}
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
                      className={`font-medium transition-colors hover:text-meow-primary ${
                        isActive(link.path) ? 'text-meow-primary' : 'text-gray-700'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side Links */}
          <div className="flex items-center gap-2">
            <Link to="/donate">
              <Button variant="meow" size="sm" className="hidden sm:flex">
                <Heart className="mr-1 h-4 w-4" /> Donate
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full p-0 h-10 w-10 overflow-hidden">
                    <Avatar>
                      <AvatarImage src={user.avatar_url || ''} alt={user.first_name || 'User'} />
                      <AvatarFallback>
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2 border-b border-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || ''} alt={user.first_name || 'User'} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === 'admin' || user.email?.endsWith('@meowrescue.org')) && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full cursor-pointer">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-1 h-4 w-4" /> Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  {link.dropdown ? (
                    <div className="space-y-2">
                      <div className="font-medium text-gray-700">{link.name}</div>
                      <ul className="pl-4 space-y-2 border-l border-gray-200">
                        {link.dropdown.map((item) => (
                          <li key={item.path}>
                            <Link
                              to={item.path}
                              className={`block transition-colors hover:text-meow-primary ${
                                isActive(item.path) ? 'text-meow-primary' : 'text-gray-600'
                              }`}
                              onClick={closeMenu}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`block font-medium transition-colors hover:text-meow-primary ${
                        isActive(link.path) ? 'text-meow-primary' : 'text-gray-700'
                      }`}
                      onClick={closeMenu}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link
                  to="/donate"
                  className="block font-medium text-meow-secondary hover:text-meow-secondary/80"
                  onClick={closeMenu}
                >
                  Donate
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default CustomNavbar;
