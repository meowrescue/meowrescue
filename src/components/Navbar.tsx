
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import NavbarScrollLogo from './NavbarScrollLogo';
import NavbarNavItems, { navItems } from './NavbarNavItems';
import NavbarUserMenu from './NavbarUserMenu';
import NavbarMobileMenu from './NavbarMobileMenu';
import NavbarRightSection from './NavbarRightSection';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  // Debug logging for navigation state
  useEffect(() => {
    console.log("Navbar mounted/updated - isMobile:", isMobile);
  }, [isMobile]);

  useEffect(() => {
    console.log("Route changed to:", location.pathname);
  }, [location.pathname]);

  const toggleMenu = () => {
    console.log("Toggling mobile menu, current state:", isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    console.log("Closing mobile menu");
    setIsMenuOpen(false);
  };

  // Used for avatar
  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
    setOpenDropdown(null);
  }, [location.pathname]);

  const isActive = (path: string) => {
    const result = location.pathname === path;
    if (isMobile) console.log(`Checking active path: ${path}, result:`, result);
    return result;
  };

  const toggleDropdown = (dropdown: string) => {
    console.log("Toggling dropdown:", dropdown, "current:", openDropdown);
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Add a click outside handler to close the menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdown when clicked outside
      if (openDropdown && !(event.target as Element).closest('.dropdown-menu-container')) {
        setOpenDropdown(null);
      }
      
      // Close mobile menu when clicked outside
      if (isMenuOpen && 
          !(event.target as Element).closest('.mobile-menu-container') && 
          !(event.target as Element).closest('button[aria-label="Toggle mobile menu"]')) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, openDropdown]);

  return (
    <div className={`w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/90'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavbarScrollLogo />

          {/* Desktop Nav */}
          <NavbarNavItems
            navItems={navItems}
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            isActive={isActive}
            setOpenDropdown={setOpenDropdown}
          />

          {/* Right Side */}
          <NavbarRightSection
            user={user}
            signOut={signOut}
            getUserInitials={getUserInitials}
            isMenuOpen={isMenuOpen}
            onMobileToggle={toggleMenu}
          />
        </div>
      </div>
      {/* Mobile Menu */}
      <div className="mobile-menu-container">
        <NavbarMobileMenu
          isMenuOpen={isMenuOpen}
          navLinks={navItems}
          onClose={closeMenu}
        />
      </div>
    </div>
  );
};

export default Navbar;
