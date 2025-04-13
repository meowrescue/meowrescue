
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSidebarContext } from '@/components/ui/sidebar';
import {
  CatIcon,
  ClipboardCheck,
  DollarSign,
  FileEditIcon,
  HomeIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Users,
  UserCircle,
  PawPrint,
  CalendarDays,
  FormInput,
} from 'lucide-react';

const AdminNavbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useSidebarContext();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Cats', href: '/admin/cats', icon: <CatIcon size={18} /> },
    { name: 'Applications', href: '/admin/applications', icon: <FormInput size={18} /> },
    { name: 'Blog', href: '/admin/blog', icon: <FileEditIcon size={18} /> },
    { name: 'Users', href: '/admin/users', icon: <Users size={18} /> },
    { name: 'Finance', href: '/admin/finance', icon: <DollarSign size={18} /> },
    { name: 'Events', href: '/admin/events', icon: <CalendarDays size={18} /> },
    { name: 'Lost & Found', href: '/admin/lost-found', icon: <Search size={18} /> },
    { name: 'Messages', href: '/admin/messages', icon: <MessageCircle size={18} /> },
    { name: 'Content', href: '/admin/pages', icon: <ClipboardCheck size={18} /> },
    { name: 'Security', href: '/admin/security', icon: <ShieldCheck size={18} /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
  ];
  
  const navContent = (
    <>
      <div className="flex items-center justify-center p-6">
        <Link to="/" className="flex items-center">
          <PawPrint className="h-8 w-8 text-meow-primary" />
          <span className="ml-2 text-lg font-semibold">Meow Rescue</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsSheetOpen(false)}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-meow-primary text-white'
                  : 'hover:bg-meow-primary/10 text-gray-800 hover:text-black'
              }`}
            >
              <span className={`mr-2 ${isActive(link.href) ? 'text-white' : 'text-meow-primary'}`}>
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserCircle className="h-5 w-5 mr-2 text-meow-primary" />
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="hover:bg-red-100 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          {navContent}
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <div 
        className={`hidden md:flex flex-col h-screen border-r transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {isSidebarOpen ? (
          navContent
        ) : (
          <div className="flex flex-col items-center py-6 h-full">
            <Link to="/" className="mb-6">
              <PawPrint className="h-8 w-8 text-meow-primary" />
            </Link>
            <div className="flex-1 flex flex-col items-center space-y-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`p-2 rounded-md transition-colors tooltip-right ${
                    isActive(link.href)
                      ? 'bg-meow-primary text-white'
                      : 'hover:bg-meow-primary/10 text-gray-800 hover:text-black'
                  }`}
                  data-tooltip={link.name}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="mt-auto mb-6 hover:bg-red-100 hover:text-red-600 tooltip-right"
              data-tooltip="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute top-4 right-0 translate-x-1/2 bg-white border rounded-full transform"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default AdminNavbar;
