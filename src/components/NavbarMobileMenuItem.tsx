
import React from "react";

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
}) => (
  <button
    type="button"
    className={`block w-full text-left font-medium transition-colors hover:text-meow-primary text-base ${
      isActive(item.path || "/") ? "text-meow-primary" : "text-gray-700"
    }`}
    onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      handleNavigation(item.path || "/");
    }}
  >
    {item.name}
  </button>
);

export default NavbarMobileMenuItem;
