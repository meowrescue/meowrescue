
import React from "react";
import { LogOut } from "lucide-react";

interface AdminSidebarLogoutProps {
  onLogout: () => void;
}

const AdminSidebarLogout: React.FC<AdminSidebarLogoutProps> = ({ onLogout }) => (
  <div className="p-4 border-t border-gray-200 mt-auto">
    <button 
      onClick={onLogout}
      className="w-full flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 font-medium"
    >
      <LogOut className="w-5 h-5" />
      <span className="ml-3">Logout</span>
    </button>
  </div>
);

export default AdminSidebarLogout;
