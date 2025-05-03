import React from "react";
import { useNavigate } from "react-router-dom";

interface NavbarMobileMenuItemProps {
  item: {
    name: string;
    path?: string;
  };
  isActive: (path: string) => boolean;
  handleNavigation: (path?: string) => void;
}

const NavbarMobileMenuItem: React.FC<NavbarMobileMenuItemProps> = ({
  item,
  isActive,
  handleNavigation
}) => {
  const navigate = typeof window !== 'undefined' ? useNavigate() : null;

  return (
    <a
      href={item.path || "/"}
      className={`block w-full text-left font-medium transition-colors hover:text-meow-primary text-base ${
        isActive(item.path || "/") ? "text-meow-primary" : "text-gray-700"
      }`}
      onClick={e => {
        if (navigate) {
          e.preventDefault();
          e.stopPropagation();
          handleNavigation(item.path || "/");
        }
        // Default <a> href behavior for static HTML
      }}
    >
      {item.name}
    </a>
  );
};

export default NavbarMobileMenuItem;
