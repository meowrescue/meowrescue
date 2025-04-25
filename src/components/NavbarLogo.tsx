
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Cat } from "lucide-react";

interface NavbarLogoProps {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
const NavbarLogo: React.FC<NavbarLogoProps> = ({ onClick }) => {
  const location = useLocation();

  return (
    <Link to="/" className="flex items-center gap-2" onClick={onClick}>
      <div className="bg-meow-primary rounded-full p-1">
        <Cat className="h-5 w-5 text-white" />
      </div>
      <span className="font-bold text-xl">
        <span className="text-meow-primary">Meow</span>
        <span className="text-meow-secondary">Rescue</span>
      </span>
    </Link>
  );
};

export default NavbarLogo;
