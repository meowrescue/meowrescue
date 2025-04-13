
import React, { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { Helmet } from 'react-helmet-async';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>{title ? `${title} | Meow Rescue Admin` : 'Meow Rescue Admin'}</title>
        </Helmet>
        
        <div className="flex">
          <AdminSidebar />
          
          <div className="flex-1">
            <AdminNavbar />
            <div className="p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
