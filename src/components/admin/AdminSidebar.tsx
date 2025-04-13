
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebarContext } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Cat,
  Users,
  FileText,
  Calendar,
  DollarSign,
  MessageSquare,
  BarChart2,
  Bell,
  MessageCircle,
  FileQuestion,
  Shield,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarContext();
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const links = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/admin/cats', icon: <Cat size={18} />, label: 'Cats' },
    { to: '/admin/applications', icon: <FileQuestion size={18} />, label: 'Applications' },
    { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
    { to: '/admin/blog', icon: <FileText size={18} />, label: 'Blog' },
    { to: '/admin/events', icon: <Calendar size={18} />, label: 'Events' },
    { to: '/admin/finance', icon: <DollarSign size={18} />, label: 'Finance' },
    { to: '/admin/messages', icon: <MessageSquare size={18} />, label: 'Messages' },
    { to: '/admin/lost-found', icon: <Bell size={18} />, label: 'Lost & Found' },
    { to: '/admin/chat', icon: <MessageCircle size={18} />, label: 'Live Chat' },
    { to: '/admin/security', icon: <Shield size={18} />, label: 'Security' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 fixed z-10",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isSidebarOpen && (
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-meow-primary rounded-full p-1">
                <Cat className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm">
                <span className="text-meow-primary">Meow</span>
                <span className="text-meow-secondary">Rescue</span>
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(!isSidebarOpen && "w-full")}
          >
            {isSidebarOpen ? '←' : '→'}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    isActive(link.to)
                      ? "bg-meow-primary/10 text-meow-primary"
                      : "text-gray-700 hover:bg-gray-100",
                    !isSidebarOpen && "justify-center"
                  )}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  {isSidebarOpen && <span className="ml-3">{link.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="destructive"
            className={cn("w-full", !isSidebarOpen && "p-2")}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {isSidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
