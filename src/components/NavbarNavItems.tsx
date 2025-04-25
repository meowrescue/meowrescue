
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const navItems = [
  { 
    name: 'About', 
    path: '/about',
  },
  { 
    name: 'Adopt', 
    path: '/cats',
    id: 'adopt-dropdown',
    dropdown: [
      { name: 'Adoptable Cats', path: '/cats' },
      { name: 'Adoption Process', path: '/adopt' },
      { name: 'Success Stories', path: '/success-stories' },
    ]
  },
  { 
    name: 'Get Involved', 
    path: '/volunteer',
    id: 'involve-dropdown',
    dropdown: [
      { name: 'Volunteer', path: '/volunteer' },
      { name: 'Foster', path: '/foster' },
      { name: 'Donate', path: '/donate' },
    ]
  },
  { 
    name: 'Resources', 
    path: '/resources',
    id: 'resources-dropdown',
    dropdown: [
      { name: 'Cat Care Tips', path: '/resources' },
      { name: 'Lost & Found', path: '/lost-found' },
      { name: 'Financial Transparency', path: '/financial-transparency' },
    ]
  },
  { name: 'Events', path: '/events' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

interface NavbarNavItemsProps {
  navItems: Array<{
    name: string;
    path?: string;
    id?: string;
    dropdown?: Array<{ name: string; path: string }>;
  }>;
  openDropdown: string | null;
  toggleDropdown: (dropdown: string) => void;
  isActive: (path: string) => boolean;
  setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
}

export const NavbarNavItems: React.FC<NavbarNavItemsProps> = ({
  navItems,
  openDropdown,
  toggleDropdown,
  isActive,
  setOpenDropdown
}) => {
  const navigate = useNavigate();
  const [isMouseInDropdown, setIsMouseInDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Function to handle dropdown item click
  const handleDropdownItemClick = (path: string) => {
    navigate(path);
    // Close dropdown after navigation
    setTimeout(() => setOpenDropdown(null), 50);
  };

  // Handle mouse enter for dropdown containers
  const handleMouseEnter = (id: string) => {
    // Clear any existing timeout
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setOpenDropdown(id);
    setIsMouseInDropdown(true);
    console.log("Mouse entered dropdown:", id);
  };

  // Handle mouse leave with improved delay logic
  const handleMouseLeave = () => {
    // Set mouse tracking state immediately
    setIsMouseInDropdown(false);
    console.log("Mouse left dropdown area");
    
    // Clear any existing timeout
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }

    // Set a new timeout to close the dropdown with delay
    const timeout = setTimeout(() => {
      // Only close if mouse is still outside the dropdown
      if (!isMouseInDropdown) {
        console.log("Closing dropdown after delay");
        setOpenDropdown(null);
      }
    }, 500); // 500ms delay

    setDropdownTimeout(timeout);
  };

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      {navItems.map((item) => {
        if (!item.dropdown) {
          return (
            <Link
              key={item.name}
              to={item.path || '/'}
              className={`px-3 py-2 rounded-md text-medium font-medium transition-colors ${
                isActive(item.path || '/') 
                  ? 'text-meow-primary' 
                  : 'text-gray-700 hover:text-meow-primary'
              }`}
            >
              {item.name}
            </Link>
          );
        }
        
        return (
          <div
            key={item.name}
            className="relative dropdown-menu-container"
            onMouseEnter={() => item.id && handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`flex items-center px-3 py-2 rounded-md text-medium font-medium transition-colors ${
                openDropdown === item.id 
                  ? 'text-meow-primary' 
                  : 'text-gray-700 hover:text-meow-primary'
              }`}
              aria-expanded={openDropdown === item.id}
            >
              {item.name}
              <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${
                openDropdown === item.id ? "rotate-180" : ""
              }`} />
            </button>
            {openDropdown === item.id && (
              <div 
                className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                onMouseEnter={() => {
                  setIsMouseInDropdown(true);
                  console.log("Mouse entered dropdown content");
                  if (dropdownTimeout) {
                    clearTimeout(dropdownTimeout);
                    setDropdownTimeout(null);
                  }
                }}
                onMouseLeave={() => {
                  setIsMouseInDropdown(false);
                  console.log("Mouse left dropdown content");
                  
                  if (dropdownTimeout) {
                    clearTimeout(dropdownTimeout);
                  }
                  
                  const timeout = setTimeout(() => {
                    if (!isMouseInDropdown) {
                      console.log("Closing dropdown content after delay");
                      setOpenDropdown(null);
                    }
                  }, 500);
                  
                  setDropdownTimeout(timeout);
                }}
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {item.dropdown.map((subItem) => (
                    <button
                      key={subItem.path}
                      className="block w-full text-left px-4 py-2 text-medium text-gray-700 hover:bg-gray-100 hover:text-meow-primary"
                      role="menuitem"
                      onClick={() => handleDropdownItemClick(subItem.path)}
                    >
                      {subItem.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default NavbarNavItems;
