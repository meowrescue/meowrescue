
import React, { ReactNode, useState } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminMobileMenu from '@/components/admin/AdminMobileMenu';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop sidebar - only visible on md+ screens */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 md:pl-64">
          {/* Navbar */}
          <AdminNavbar onMenuClick={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
          
          {/* Mobile menu */}
          <AdminMobileMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} />
          
          {/* Main content area */}
          <main className="flex-1 pt-16">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
