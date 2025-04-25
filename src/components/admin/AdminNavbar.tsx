
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import NavbarLogo from "@/components/NavbarLogo";

interface AdminNavbarProps {
  onMenuClick: () => void;
  isMenuOpen?: boolean; // Add optional prop to track menu state
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onMenuClick, isMenuOpen }) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-4 fixed top-0 right-0 left-0 z-30 md:pl-64">
      <div className="flex items-center justify-between w-full">
        {/* Left side: Logo and title for mobile */}
        <div className="md:hidden">
          <NavbarLogo />
        </div>
        
        {/* Right side: Hamburger menu/X for mobile */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
