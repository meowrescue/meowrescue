import React from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
}) => {
  const navigate = typeof window !== 'undefined' ? useNavigate() : null;
  return (
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
              <a
                href={subItem.path}
                className={`block w-full text-left py-0 transition-colors text-base ${
                  isActive(subItem.path) ? "text-meow-primary" : "text-gray-600"
                }`}
                onClick={e => {
                  if (navigate) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNavigation(subItem.path);
                  }
                  // Default <a> href behavior for static HTML
                }}
              >
                {subItem.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavbarMobileDropdown;
