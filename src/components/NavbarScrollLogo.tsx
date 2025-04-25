
import React from "react";
import NavbarLogo from "./NavbarLogo";
import { useLocation } from "react-router-dom";

const NavbarScrollLogo: React.FC = () => {
  const location = useLocation();

  return (
    <NavbarLogo
      onClick={e => {
        if (location.pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    />
  );
};

export default NavbarScrollLogo;
