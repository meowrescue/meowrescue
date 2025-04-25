
import React from "react";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavbarUserMenu from "./NavbarUserMenu";

interface NavbarRightSectionProps {
  user: any;
  signOut: () => void;
  getUserInitials: (firstName?: string, lastName?: string) => string;
  isMenuOpen: boolean;
  onMobileToggle: () => void;
}

const NavbarRightSection: React.FC<NavbarRightSectionProps> = ({
  user,
  signOut,
  getUserInitials,
  isMenuOpen,
  onMobileToggle,
}) => (
  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
    <a href="/donate" className="mr-1">
      <Button variant="meowSecondary" size="sm" className="hidden sm:flex">
        <Heart className="mr-1 h-4 w-4" /> Donate
      </Button>
    </a>
    <NavbarUserMenu
      user={user}
      signOut={signOut}
      getUserInitials={getUserInitials}
    />
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={onMobileToggle}
      aria-label="Toggle mobile menu"
    >
      {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </Button>
  </div>
);

export default NavbarRightSection;
