
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Cat, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  FileText, 
  Settings, 
  Lock,
  Search,
  ClipboardList,
  MessageCircle,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarContext } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebarContext();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/cats', label: 'Cats', icon: <Cat size={20} /> },
    { path: '/admin/applications', label: 'Applications', icon: <ClipboardList size={20} /> },
    { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
    { path: '/admin/events', label: 'Events', icon: <Calendar size={20} /> },
    { path: '/admin/finance', label: 'Income', icon: <DollarSign size={20} /> },
    { path: '/admin/messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { path: '/admin/chat', label: 'Chat', icon: <MessageCircle size={20} /> },
    { path: '/admin/lost-found', label: 'Lost & Found', icon: <Search size={20} /> },
    { path: '/admin/blog', label: 'Blog', icon: <FileText size={20} /> },
    { path: '/admin/security', label: 'Security', icon: <Lock size={20} /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  return (
    <aside 
      className="bg-white border-r border-gray-200 w-64 h-screen sticky top-0 z-40 overflow-y-auto"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link 
            to="/" 
            className="font-bold text-xl flex items-center"
          >
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
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-meow-primary/10 text-meow-primary'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-meow-primary'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Button 
            onClick={handleLogout}
            className="flex w-full items-center text-gray-700 hover:text-meow-primary"
            variant="ghost"
          >
            <LogOut size={20} className="mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminNavbar;
