
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { X, Menu, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isMenuOpen ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.svg" alt="Meow Rescue" className="h-10" />
        </Link>

        {/* Desktop Navigation */}
        <div className={`hidden md:flex items-center space-x-1`}>
          <Link to="/cats">
            <Button
              variant="ghost"
              className={isActive('/cats') ? 'text-meow-primary' : ''}
            >
              Cats
            </Button>
          </Link>
          <Link to="/about">
            <Button
              variant="ghost"
              className={isActive('/about') ? 'text-meow-primary' : ''}
            >
              About
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`flex items-center gap-1 ${
                  isActive('/lost-found') || isActive('/forum') ? 'text-meow-primary' : ''
                }`}
              >
                Community <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/lost-found" className="w-full cursor-pointer">Lost & Found</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/forum" className="w-full cursor-pointer">Forum</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/events" className="w-full cursor-pointer">Events</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`flex items-center gap-1 ${
                  isActive('/volunteer') || isActive('/adopt') ? 'text-meow-primary' : ''
                }`}
              >
                Get Involved <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/adopt" className="w-full cursor-pointer">Adopt</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/volunteer" className="w-full cursor-pointer">Volunteer/Foster</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/resources">
            <Button
              variant="ghost"
              className={isActive('/resources') ? 'text-meow-primary' : ''}
            >
              Resources
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="ghost"
              className={isActive('/contact') ? 'text-meow-primary' : ''}
            >
              Contact
            </Button>
          </Link>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center">
          <Link to="/donate" className="hidden md:block mr-4">
            <Button variant="meow">Donate</Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-full"
                >
                  <User size={20} />
                  <span className="hidden md:inline-block">
                    {user.user_metadata?.first_name || user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                {/* Admin Link */}
                {user && (user.email === 'patrick@meowrescue.org' || user.user_metadata?.role === 'admin') && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button variant="ghost">Login</Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link to="/cats">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive('/cats') ? 'text-meow-primary' : ''}`}
              >
                Cats
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive('/about') ? 'text-meow-primary' : ''}`}
              >
                About
              </Button>
            </Link>
            
            <div className="px-3 font-medium text-sm text-gray-500">Community</div>
            <Link to="/lost-found">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive('/lost-found') ? 'text-meow-primary' : ''}`}
              >
                Lost & Found
              </Button>
            </Link>
            <Link to="/forum">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive('/forum') ? 'text-meow-primary' : ''}`}
              >
                Forum
              </Button>
            </Link>
            <Link to="/events">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive('/events') ? 'text-meow-primary' : ''}`}
              >
                Events
              </Button>
            </Link>
            
            <div className="px-3 font-medium text-sm text-gray-500">Get Involved</div>
            <Link to="/adopt">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive('/adopt') ? 'text-meow-primary' : ''}`}
              >
                Adopt
              </Button>
            </Link>
            <Link to="/volunteer">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive('/volunteer') ? 'text-meow-primary' : ''}`}
              >
                Volunteer/Foster
              </Button>
            </Link>
            
            <Link to="/resources">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive('/resources') ? 'text-meow-primary' : ''}`}
              >
                Resources
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive('/contact') ? 'text-meow-primary' : ''}`}
              >
                Contact
              </Button>
            </Link>
            
            <div className="border-t pt-4">
              <Link to="/donate">
                <Button variant="meow" className="w-full">Donate</Button>
              </Link>
            </div>
            
            {!user && (
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
