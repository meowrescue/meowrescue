
import React, { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
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
        <AdminSidebar />
        
        <div className="flex-1 pl-64"> {/* This ensures content doesn't overlap with sidebar */}
          <AdminNavbar />
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Create a default Admin component that uses the AdminLayout
const Admin: React.FC = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <p className="text-gray-600">View summary information about shelter operations.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600">See recent events and updates at the shelter.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Urgent Items</h2>
          <p className="text-gray-600">View items requiring immediate attention.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
// We also export the layout component for use in other admin pages
export { AdminLayout };
