
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminNavbar from '@/components/AdminNavbar';
import SEO from '@/components/SEO';
import { Cat } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = "Admin Dashboard" }) => {
  const { user, isLoading } = useAuth();
  
  // Check if the user has @meowrescue.org email
  const isAdmin = user?.email?.endsWith('@meowrescue.org');
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return (
    <>
      <SEO title={`${title} | Meow Rescue Admin`} />
      <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col md:flex-row">
          <AdminNavbar />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="md:hidden mb-4 sm:mb-6 flex items-center">
              <div className="flex items-center gap-2">
                <div className="bg-meow-primary rounded-full p-1">
                  <Cat className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">
                  <span className="text-meow-primary">Meow</span>
                  <span className="text-meow-secondary">Rescue</span>
                </span>
              </div>
            </div>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};

export default AdminLayout;
