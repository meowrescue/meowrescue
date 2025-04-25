
import React from "react";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  name: string;
  path: string;
}
interface NavbarMobileDropdownProps {
  item: {
    name: string;
    id: string;
    dropdown: DropdownItem[];
  };
  openDropdown: string | null;
  toggleDropdown: (id: string) => void;
  handleNavigation: (path: string) => void;
  isActive: (path: string) => boolean;
}

const NavbarMobileDropdown: React.FC<NavbarMobileDropdownProps> = ({
  item,
  openDropdown,
  toggleDropdown,
  handleNavigation,
  isActive
}) => (
  <div className="space-y-0">
    <button
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown(item.id);
      }}
      className="flex items-center justify-between w-full font-medium text-gray-700 text-base"
      type="button"
    >
      <span>{item.name}</span>
      <ChevronDown className={`h-4 w-4 transform transition-transform ${openDropdown === item.id ? "rotate-180" : ""}`} />
    </button>
    {openDropdown === item.id && (
      <ul className="pl-4 mt-4 border-l border-gray-200">
        {item.dropdown.map((subItem, idx) => (
          <li key={subItem.path} className={`${idx === 0 ? 'mt-4' : 'mt-4'} mb-4`}>
            <button
              type="button"
              className={`block w-full text-left py-0 transition-colors text-base ${
                isActive(subItem.path) ? "text-meow-primary" : "text-gray-600"
              }`}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigation(subItem.path);
              }}
            >
              {subItem.name}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default NavbarMobileDropdown;

