
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/90'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
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
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Adopt</NavigationMenuTrigger>
                  <NavigationMenuContent className="origin-top-center">
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-meow-primary/50 to-meow-primary p-6 no-underline outline-none focus:shadow-md"
                            href="/cats"
                          >
                            <Cat className="h-6 w-6 text-white" />
                            <div className="mb-2 mt-4 text-lg font-medium text-white">
                              Available Cats
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              Browse all our cats ready for adoption
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/adopt" title="Adoption Process">
                        Learn about our adoption requirements and steps
                      </ListItem>
                      <ListItem href="/resources" title="Adoption Resources">
                        Helpful guides for new cat parents
                      </ListItem>
                      <ListItem href="/events" title="Adoption Events">
                        Meet cats in person at our upcoming events
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Get Involved</NavigationMenuTrigger>
                  <NavigationMenuContent className="origin-top-center">
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <ListItem href="/volunteer" title="Volunteer">
                        Join our team of dedicated volunteers
                      </ListItem>
                      <ListItem href="/donate" title="Donate">
                        Support our mission with a donation
                      </ListItem>
                      <ListItem href="/foster" title="Foster">
                        Help us care for cats in your home
                      </ListItem>
                      <ListItem href="/events" title="Events">
                        Participate in our upcoming events
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/lost-found">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Lost & Found
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent className="origin-top-center">
                    <ul className="grid gap-3 p-4 w-[400px]">
                      <ListItem href="/blog" title="Blog">
                        Read our latest articles and updates
                      </ListItem>
                      <ListItem href="/resources" title="Cat Care Resources">
                        Guides for new and experienced cat owners
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
                  <Button variant="outline" size="icon" className="rounded-full">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={4}>
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
              <li>
                <Link
                  to="/"
                  className={`block font-medium transition-colors hover:text-meow-primary ${
                    isActive('/') ? 'text-meow-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`block font-medium transition-colors hover:text-meow-primary ${
                    isActive('/about') ? 'text-meow-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/cats"
                  className={`block font-medium transition-colors hover:text-meow-primary ${
                    isActive('/cats') ? 'text-meow-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Adopt
                </Link>
              </li>
              <li>
                <Link
                  to="/volunteer"
                  className={`block font-medium transition-colors hover:text-meow-primary ${
                    isActive('/volunteer') ? 'text-meow-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Volunteer
                </Link>
              </li>
              <li>
                <Link
                  to="/foster"
                  className={`block font-medium transition-colors hover:text-meow-primary ${
                    isActive('/foster') ? 'text-meow-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Foster
                </Link>
              </li>
              <li>
                <Link
                  to="/lost-found"
                  className={`block font-medium transition-colors hover:text-meow-primary ${
                    isActive('/lost-found') ? 'text-meow-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Lost & Found
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className={`block font-medium transition-colors hover:text-meow-primary ${
                    isActive('/blog') ? 'text-meow-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className={`block font-medium transition-colors hover:text-meow-primary ${
                    isActive('/resources') ? 'text-meow-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className={`block font-medium transition-colors hover:text-meow-primary ${
                    isActive('/events') ? 'text-meow-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`block font-medium transition-colors hover:text-meow-primary ${
                    isActive('/contact') ? 'text-meow-primary' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </li>
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
