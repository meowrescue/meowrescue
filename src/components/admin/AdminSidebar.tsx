
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Cat,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  Users,
  MessageCircle,
  Mail,
  Shield,
  FileImage,
  Search,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 text-gray-700 p-4 flex flex-col h-screen z-10 overflow-auto">
      <div className="mb-4 mt-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-meow-primary rounded-full p-2">
            <Cat className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl">
            <span className="text-meow-primary">Meow</span>
            <span className="text-meow-secondary">Rescue</span>
          </span>
        </Link>
      </div>
      
      <div className="flex-1 space-y-4">
        {/* Dashboard Section */}
        <div>
          <h3 className="font-semibold text-xs uppercase text-gray-500 mb-2 px-3">Dashboard</h3>
          <Link 
            to="/admin"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="mr-3 h-5 w-5 text-gray-600" />
            <span>Dashboard</span>
          </Link>
        </div>
        
        {/* Users & Cats Section */}
        <div>
          <h3 className="font-semibold text-xs uppercase text-gray-500 mb-2 px-3">Management</h3>
          <Link 
            to="/admin/users"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/users') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <Users className="mr-3 h-5 w-5 text-gray-600" />
            <span>Users</span>
          </Link>
          
          <Link 
            to="/admin/cats"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/cats') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <Cat className="mr-3 h-5 w-5 text-gray-600" />
            <span>Cats</span>
          </Link>
          
          <Link 
            to="/admin/applications"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/applications') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <FileText className="mr-3 h-5 w-5 text-gray-600" />
            <span>Applications</span>
          </Link>
        </div>
        
        {/* Content Section */}
        <div>
          <h3 className="font-semibold text-xs uppercase text-gray-500 mb-2 px-3">Content</h3>
          <Link 
            to="/admin/events"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/events') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <Calendar className="mr-3 h-5 w-5 text-gray-600" />
            <span>Events</span>
          </Link>
          
          <Link 
            to="/admin/blog"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/blog') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <FileImage className="mr-3 h-5 w-5 text-gray-600" />
            <span>Blog</span>
          </Link>
          
          <Link 
            to="/admin/lost-found"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/lost-found') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <Search className="mr-3 h-5 w-5 text-gray-600" />
            <span>Lost & Found</span>
          </Link>
        </div>
        
        {/* Operations Section */}
        <div>
          <h3 className="font-semibold text-xs uppercase text-gray-500 mb-2 px-3">Operations</h3>
          <Link 
            to="/admin/finance"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/finance') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <DollarSign className="mr-3 h-5 w-5 text-gray-600" />
            <span>Finance</span>
          </Link>
          
          <Link 
            to="/admin/chat"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/chat') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="mr-3 h-5 w-5 text-gray-600" />
            <span>Live Chat</span>
          </Link>
          
          <Link 
            to="/admin/messages"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/messages') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <Mail className="mr-3 h-5 w-5 text-gray-600" />
            <span>Contact Messages</span>
          </Link>
        </div>
        
        {/* System Section */}
        <div>
          <h3 className="font-semibold text-xs uppercase text-gray-500 mb-2 px-3">System</h3>
          <Link 
            to="/admin/security"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/security') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <Shield className="mr-3 h-5 w-5 text-gray-600" />
            <span>Security</span>
          </Link>
          
          <Link 
            to="/admin/settings"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/settings') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <Settings className="mr-3 h-5 w-5 text-gray-600" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
      
      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center p-2 rounded transition-colors hover:bg-gray-100 w-full text-gray-700"
      >
        <LogOut className="mr-3 h-5 w-5 text-gray-600" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default AdminSidebar;
