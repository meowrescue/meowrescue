
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Cat,
  Users,
  FileText,
  Calendar,
  DollarSign,
  MessageSquare,
  MessageCircle,
  FileQuestion,
  Shield,
  LogOut,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
      className="bg-white border-r border-gray-200 w-64 h-screen fixed z-40 overflow-y-auto"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl flex items-center">
            <div className="flex items-center gap-2">
              <div className="bg-meow-primary rounded-full p-1">
                <Cat className="h-5 w-5 text-white" />
              </div>
              <span>
                <span className="text-meow-primary">Meow</span>
                <span className="text-meow-secondary">Rescue</span>
              </span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-meow-primary/10 text-meow-primary'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-meow-primary'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="px-2 border-t border-gray-200 py-4">
          <Button 
            onClick={handleLogout}
            className="flex w-full items-center text-gray-700 hover:text-meow-primary px-3 justify-start"
            variant="ghost"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
