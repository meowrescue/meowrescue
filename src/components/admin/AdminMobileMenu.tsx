
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import MobileMenuPanel from "../MobileMenuPanel";
import AdminMobileMenuList from "./AdminMobileMenuList";

interface AdminMobileMenuProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const AdminMobileMenu: React.FC<AdminMobileMenuProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleNav = (path: string) => {
    console.log("Admin mobile menu navigating to:", path);
    
    // First navigate
    navigate(path);
    
    // Then close with a delay to ensure navigation happens first
    setTimeout(() => {
      console.log("Closing admin mobile menu");
      onOpenChange(false);
    }, 200); // Increased delay for navigation
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    try {
      console.log("Admin logout initiated");
      await signOut();
      onOpenChange(false);
      setTimeout(() => navigate('/'), 200);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!open) return null;

  // Panel lines up with bottom of navbar (top-16)
  return (
    <MobileMenuPanel className="top-16 border-t-0" style={{marginTop: 0}}>
      <AdminMobileMenuList onNav={handleNav} />
      <li className="border-t border-gray-200 mt-2 pt-2">
        <button
          type="button"
          className="flex items-center w-full text-gray-700 px-2 py-2 rounded-lg font-medium hover:text-meow-primary transition text-base"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-3" />
          <span className="text-base">Logout</span>
        </button>
      </li>
    </MobileMenuPanel>
  );
};

export default AdminMobileMenu;
