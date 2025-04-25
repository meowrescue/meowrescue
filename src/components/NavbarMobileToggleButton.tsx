
import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarMobileToggleButtonProps {
  isMenuOpen: boolean;
  onClick: () => void;
}

const NavbarMobileToggleButton: React.FC<NavbarMobileToggleButtonProps> = ({
  isMenuOpen,
  onClick,
}) => (
  <Button
    variant="ghost"
    size="icon"
    className="lg:hidden"
    onClick={onClick}
    aria-label="Toggle mobile menu"
  >
    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
  </Button>
);

export default NavbarMobileToggleButton;
