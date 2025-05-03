import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarMobileDropdown from "./NavbarMobileDropdown";
import NavbarMobileMenuItem from "./NavbarMobileMenuItem";
import { Heart } from "lucide-react";

interface DropdownItem {
  name: string;
  path: string;
}
interface NavItem {
  name: string;
  path?: string;
  dropdown?: DropdownItem[];
  id?: string;
}

interface NavbarMobileMenuProps {
  isMenuOpen: boolean;
  navLinks: NavItem[];
  onClose: () => void;
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  isMenuOpen,
  navLinks,
  onClose,
}) => {
  const navigate = typeof window !== 'undefined' ? useNavigate() : null;
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const isActive = (path: string) => window.location.pathname === path;

  const handleNavigation = (path: string) => {
    if (navigate) {
      navigate(path);
      setTimeout(() => {
        onClose();
      }, 500); // Increased delay to ensure menu closes properly
    }
    // For static HTML, the href on the <a> tag will handle navigation
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  if (!isMenuOpen) return null;

  return (
    <div className="lg:hidden bg-white border-t border-gray-200 max-h-[80vh] overflow-y-auto">
      <div className="container mx-auto px-4 py-4">
        <ul className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <li key={link.name}>
              {link.dropdown ? (
                <NavbarMobileDropdown
                  item={{
                    name: link.name,
                    id: link.id || link.name,
                    dropdown: link.dropdown,
                  }}
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  handleNavigation={handleNavigation}
                  isActive={isActive}
                />
              ) : (
                <NavbarMobileMenuItem
                  item={link}
                  isActive={isActive}
                  handleNavigation={handleNavigation}
                />
              )}
            </li>
          ))}
          <li>
            <a
              href="/donate"
              className="block w-full text-left font-bold text-meow-primary hover:text-meow-primary/90 text-lg py-2 px-3 rounded-md bg-meow-secondary/10 border border-meow-secondary/20"
              onClick={e => {
                if (navigate) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavigation("/donate");
                }
                // Default <a> href behavior for static HTML
              }}
            >
              <div className="flex items-center justify-center">
                <Heart className="mr-2 h-5 w-5 fill-meow-primary" />
                Donate Now
              </div>
            </a>
          </li>
          {/* Removing the duplicate Financial Transparency link that was here */}
        </ul>
      </div>
    </div>
  );
};

export default NavbarMobileMenu;
