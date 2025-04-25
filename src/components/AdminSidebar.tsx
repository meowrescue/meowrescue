
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

import {
  Cat,
  UserCog,
  CalendarDays,
  LayoutDashboard,
  FileText,
  MessageSquare,
  User,
  Settings,
  Map,
  DollarSign,
  Heart,
  ChevronRight,
  ChevronLeft,
  BarChart,
  ShieldAlert,
  LayoutTemplate,
  Mail
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Cats', path: '/admin/cats', icon: <Cat size={20} /> },
    { label: 'Applications', path: '/admin/applications', icon: <FileText size={20} /> },
    { label: 'Messages', path: '/admin/messages', icon: <Mail size={20} /> },
    { label: 'Chat', path: '/admin/chat', icon: <MessageSquare size={20} /> },
    { label: 'Users', path: '/admin/users', icon: <User size={20} /> },
    { label: 'Events', path: '/admin/events', icon: <CalendarDays size={20} /> },
    { label: 'Lost & Found', path: '/admin/lost-found', icon: <Map size={20} /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart size={20} /> },
    { label: 'Finance', path: '/admin/finance', icon: <DollarSign size={20} /> },
    { label: 'Blog', path: '/admin/blog', icon: <Heart size={20} /> },
    { label: 'Pages', path: '/admin/pages', icon: <LayoutTemplate size={20} /> },
    { label: 'Security', path: '/admin/security', icon: <ShieldAlert size={20} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col overflow-hidden fixed top-0 left-0 z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn(
        "p-4 border-b border-gray-200 flex items-center",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && <span className="font-bold text-lg text-meow-primary">Admin Panel</span>}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <nav>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    isCollapsed ? "justify-center" : "justify-start",
                    location.pathname === item.path 
                      ? "bg-meow-primary text-white hover:bg-meow-primary/90" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/"
          className={cn(
            "flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <UserCog size={20} />
          {!isCollapsed && <span className="ml-3 truncate">Back to Site</span>}
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
