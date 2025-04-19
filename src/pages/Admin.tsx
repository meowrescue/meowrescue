
import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{title ? `${title} | Meow Rescue Admin` : 'Meow Rescue Admin'}</title>
      </Helmet>
      
      <div className="flex">
        <div>AdminSidebar Placeholder</div>
        
        <div className="flex-1 pl-64">
          <div>AdminNavbar Placeholder</div>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
