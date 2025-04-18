import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Heart, 
  Search, 
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

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scrollToTop();
    }
  };

  // Get user initials for avatar
  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    
    return `${firstInitial}${lastInitial}`.toUpperCase();
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
    setOpenDropdown(null);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  // Navigation structure
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { 
      name: 'Adopt', 
      id: 'adopt',
      dropdown: [
        { name: 'Adoptable Cats', path: '/cats' },
        { name: 'Adoption Process', path: '/adopt' },
        { name: 'Success Stories', path: '/success-stories' },
      ]
    },
    { 
      name: 'Get Involved', 
      id: 'get-involved',
      dropdown: [
        { name: 'Volunteer', path: '/volunteer' },
        { name: 'Foster', path: '/foster' },
        { name: 'Donate', path: '/donate' },
      ]
    },
    { 
      name: 'Resources', 
      id: 'resources',
      dropdown: [
        { name: 'Cat Care Tips', path: '/resources' },
        { name: 'Lost & Found', path: '/lost-found' },
      ]
    },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/90'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={handleLogoClick}>
            <div className="bg-meow-primary rounded-full p-2">
              <Cat className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-meow-primary">Meow</span>
              <span className="text-meow-secondary">Rescue</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.name} className="relative">
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className={`inline-flex items-center gap-1 font-medium transition-colors hover:text-meow-primary ${
                          openDropdown === item.id ? 'text-meow-primary' : 'text-gray-700'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      
                      {openDropdown === item.id && (
                        <div 
                          className="absolute bg-white shadow-md rounded-md py-2 mt-1 min-w-[180px] z-50"
                          style={{ left: '50%', transform: 'translateX(-50%)' }}
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                                isActive(subItem.path) ? 'text-meow-primary' : 'text-gray-700'
                              }`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`font-medium transition-colors hover:text-meow-primary ${
                        isActive(item.path) ? 'text-meow-primary' : 'text-gray-700'
                      }`}
                    >
                      {item.name}
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
                        {getUserInitials(user.first_name, user.last_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={4} className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2 border-b border-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || ''} alt={user.first_name || 'User'} />
                      <AvatarFallback>{getUserInitials(user.first_name, user.last_name)}</AvatarFallback>
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
                  {(user.role === 'admin' || user.email === 'patrick@meowrescue.org' || user.email?.endsWith('@meowrescue.org')) && (
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
        <div className="lg:hidden bg-white border-t border-gray-200 fixed top-16 left-0 right-0 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  {item.dropdown ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className="flex items-center justify-between w-full font-medium text-gray-700"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`h-4 w-4 transform transition-transform ${openDropdown === item.id ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {openDropdown === item.id && (
                        <ul className="pl-4 space-y-2 border-l border-gray-200">
                          {item.dropdown.map((subItem) => (
                            <li key={subItem.path}>
                              <Link
                                to={subItem.path}
                                className={`block transition-colors hover:text-meow-primary ${
                                  isActive(subItem.path) ? 'text-meow-primary' : 'text-gray-600'
                                }`}
                                onClick={closeMenu}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`block font-medium transition-colors hover:text-meow-primary ${
                        isActive(item.path) ? 'text-meow-primary' : 'text-gray-700'
                      }`}
                      onClick={closeMenu}
                    >
                      {item.name}
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

export default Navbar;
