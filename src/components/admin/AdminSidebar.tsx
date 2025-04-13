
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Search
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white p-4 flex flex-col h-screen z-10">
      <div className="mb-8 mt-2">
        <h1 className="text-xl font-bold flex items-center">
          <Cat className="mr-2" /> Meow Rescue Admin
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1">
        <Link 
          to="/admin"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="mr-3 h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/admin/users"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin/users') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <Users className="mr-3 h-5 w-5" />
          <span>Users</span>
        </Link>
        
        <Link 
          to="/admin/cats"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin/cats') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <Cat className="mr-3 h-5 w-5" />
          <span>Cats</span>
        </Link>
        
        <Link 
          to="/admin/applications"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin/applications') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <FileText className="mr-3 h-5 w-5" />
          <span>Applications</span>
        </Link>
        
        <Link 
          to="/admin/events"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin/events') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <Calendar className="mr-3 h-5 w-5" />
          <span>Events</span>
        </Link>
        
        <Link 
          to="/admin/finance"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin/finance') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <DollarSign className="mr-3 h-5 w-5" />
          <span>Finance</span>
        </Link>
        
        <Link 
          to="/admin/blog"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin/blog') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <FileImage className="mr-3 h-5 w-5" />
          <span>Blog</span>
        </Link>
        
        <Link 
          to="/admin/lost-found"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin/lost-found') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <Search className="mr-3 h-5 w-5" />
          <span>Lost & Found</span>
        </Link>
        
        <Link 
          to="/admin/chat"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin/chat') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <MessageCircle className="mr-3 h-5 w-5" />
          <span>Live Chat</span>
        </Link>
        
        <Link 
          to="/admin/messages"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin/messages') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <Mail className="mr-3 h-5 w-5" />
          <span>Contact Messages</span>
        </Link>
        
        <Link 
          to="/admin/security"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin/security') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <Shield className="mr-3 h-5 w-5" />
          <span>Security</span>
        </Link>
        
        <Link 
          to="/admin/settings"
          className={`flex items-center p-3 rounded transition-colors ${
            isActive('/admin/settings') ? 'bg-slate-700' : 'hover:bg-slate-800'
          }`}
        >
          <Settings className="mr-3 h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
