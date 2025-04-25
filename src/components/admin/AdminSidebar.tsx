
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Cat } from 'lucide-react';
import AdminSidebarMenuGroups from './AdminSidebarMenuGroups';
import AdminSidebarLogout from './AdminSidebarLogout';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-white border-r z-40 shadow-md h-full min-h-screen w-64 flex flex-col fixed top-0 left-0">
      {/* Logo + site name at the very top, left-aligned */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-meow-primary rounded-full p-1 flex items-center justify-center" style={{ width: 32, height: 32 }}>
            <Cat className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">
            <span className="text-meow-primary">Meow</span>
            <span className="text-meow-secondary">Rescue</span>
          </span>
        </Link>
      </div>
      
      {/* Sidebar navigation with clear separation from logo */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          <AdminSidebarMenuGroups user={user} isActive={isActive} />
        </ul>
      </nav>
      
      {/* Static logout */}
      <AdminSidebarLogout onLogout={handleLogout} />
    </div>
  );
};

export default AdminSidebar;
