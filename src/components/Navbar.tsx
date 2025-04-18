
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Cat, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { scrollToTop } from '@/utils/scrollUtils';
import { useMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const isMobile = useMobile();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      closeMenu();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
  }`;

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Adoptable Cats', path: '/cats' },
    { label: 'Lost & Found', path: '/lost-found' },
    { label: 'Success Stories', path: '/success-stories' },
    { label: 'Events', path: '/events' },
    { label: 'Blog', path: '/blog' },
    { label: 'Get Involved', 
      submenu: [
        { label: 'Volunteer', path: '/volunteer' },
        { label: 'Foster', path: '/foster' },
        { label: 'Donate', path: '/donate' },
      ]
    },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center" 
            onClick={scrollToTop}
          >
            <div className={`rounded-full p-2 ${isScrolled ? 'bg-meow-primary' : 'bg-white'}`}>
              <Cat className={`h-6 w-6 ${isScrolled ? 'text-white' : 'text-meow-primary'}`} />
            </div>
            <span className="text-xl font-bold ml-2">
              <span className={isScrolled ? 'text-meow-primary' : 'text-white'}>Meow</span>
              <span className="text-meow-secondary">Rescue</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              item.submenu ? (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`${
                        isScrolled ? 'text-gray-900 hover:text-meow-primary' : 'text-white hover:text-meow-secondary'
                      } flex items-center px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white rounded-md shadow-lg py-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <DropdownMenuItem key={subIndex} asChild>
                        <Link 
                          to={subItem.path} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-meow-primary"
                          onClick={scrollToTop}
                        >
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className={`${
                    isActive(item.path) 
                      ? (isScrolled ? 'text-meow-primary' : 'text-meow-secondary') 
                      : (isScrolled ? 'text-gray-900 hover:text-meow-primary' : 'text-white hover:text-meow-secondary')
                  } px-3 py-2 rounded-md text-sm font-medium`}
                  onClick={scrollToTop}
                >
                  {item.label}
                </Link>
              )
            ))}
            
            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2 ml-2">
                {user.email?.endsWith('@meowrescue.org') && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className={`${isScrolled ? 'border-meow-primary text-meow-primary' : 'border-white text-white'}`}
                    asChild
                  >
                    <Link to="/admin" onClick={scrollToTop}>
                      Admin
                    </Link>
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  className={`${isScrolled ? 'border-meow-primary text-meow-primary' : 'border-white text-white'}`}
                  asChild
                >
                  <Link to="/profile" onClick={scrollToTop}>
                    Profile
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className={`${isScrolled ? 'border-meow-primary text-meow-primary' : 'border-white text-white'}`}
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className={`${isScrolled ? 'border-meow-primary text-meow-primary' : 'border-white text-white'}`}
                  asChild
                >
                  <Link to="/login" onClick={scrollToTop}>
                    Sign In
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  variant="meow"
                  asChild
                >
                  <Link to="/donate" onClick={scrollToTop}>
                    <Heart className="h-4 w-4 mr-1" /> Donate
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Button 
              size="sm" 
              variant="meow"
              className="mr-2 hidden sm:flex"
              asChild
            >
              <Link to="/donate" onClick={scrollToTop}>
                <Heart className="h-4 w-4 mr-1" /> Donate
              </Link>
            </Button>
            
            <button
              onClick={toggleMenu}
              className={`${
                isScrolled ? 'text-gray-900' : 'text-white'
              } inline-flex items-center justify-center p-2 rounded-md focus:outline-none`}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="lg:hidden h-screen overflow-auto bg-white">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item, index) => (
                item.submenu ? (
                  <div key={index} className="py-2">
                    <div className="px-3 py-2 font-medium text-gray-900">
                      {item.label}
                    </div>
                    <div className="ml-4 border-l-2 border-gray-200 pl-4 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className={`${
                            isActive(subItem.path) ? 'text-meow-primary' : 'text-gray-700 hover:text-meow-primary'
                          } block px-3 py-2 rounded-md text-base font-medium`}
                          onClick={scrollToTop}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={index}
                    to={item.path}
                    className={`${
                      isActive(item.path) ? 'text-meow-primary' : 'text-gray-900 hover:text-meow-primary'
                    } block px-3 py-2 rounded-md text-base font-medium`}
                    onClick={scrollToTop}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            
              {/* Auth Links */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="px-3 font-medium text-gray-900">Account</div>
                <div className="mt-3 space-y-1">
                  {user ? (
                    <>
                      {user.email?.endsWith('@meowrescue.org') && (
                        <Link
                          to="/admin"
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-meow-primary"
                          onClick={scrollToTop}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-meow-primary"
                        onClick={scrollToTop}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-meow-primary"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-meow-primary"
                        onClick={scrollToTop}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-meow-primary"
                        onClick={scrollToTop}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
              
              <div className="px-5 py-4">
                <Button variant="meow" className="w-full" asChild>
                  <Link to="/donate" onClick={scrollToTop}>
                    <Heart className="h-4 w-4 mr-2" /> Donate Now
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
