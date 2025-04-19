
import React, { ReactNode, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import { SidebarProvider } from '../components/ui/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>{title ? `${title} | Meow Rescue Admin` : 'Meow Rescue Admin'}</title>
        </Helmet>
        
        <div className="flex h-screen w-full">
          <AdminSidebar />
          
          <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'}`}>
            <AdminNavbar />
            <div className="p-4 mt-16">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
