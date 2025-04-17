import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Cat,
  Calendar,
  FileText,
  DollarSign,
  Users,
  MessageCircle,
  Mail,
  Shield,
  FileImage,
  Search,
  LogOut,
  Package
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [unreadChat, setUnreadChat] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  // Fetch unread counts using the new RPC function
  const { data: unreadCounts, refetch: refetchUnreadCounts } = useQuery({
    queryKey: ['unreadCounts'],
    queryFn: async () => {
      try {
        console.log("Fetching unread counts");
        
        // Use the RPC function to get counts
        const { data, error } = await supabase
          .rpc('get_unread_counts', { user_id: (await supabase.auth.getUser()).data.user?.id });
          
        if (error) {
          console.error("Error fetching unread counts from RPC:", error);
          // Fallback to direct queries if RPC fails
          return await fallbackFetchCounts();
        }
        
        console.log("Unread counts from RPC:", data);
        return {
          chatCount: data.chat_count || 0,
          messageCount: data.message_count || 0
        };
      } catch (err) {
        console.error("Error in unreadCounts query:", err);
        return { chatCount: 0, messageCount: 0 };
      }
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
  // Fallback function to fetch counts directly if RPC fails
  const fallbackFetchCounts = async () => {
    try {
      // Count unread chat messages
      const { data: chatData, error: chatError } = await supabase
        .from('chat_messages')
        .select('id')
        .eq('is_admin', false)
        .is('read_at', null);
        
      if (chatError) throw chatError;
      
      // Count unread contact messages
      const { data: messageData, error: messageError } = await supabase
        .from('contact_messages')
        .select('id')
        .eq('status', 'New');
        
      if (messageError) throw messageError;
      
      return {
        chatCount: chatData?.length || 0,
        messageCount: messageData?.length || 0
      };
    } catch (err) {
      console.error("Error in fallback fetch for unread counts:", err);
      return { chatCount: 0, messageCount: 0 };
    }
  };
  
  // Update badges when data changes
  useEffect(() => {
    if (unreadCounts) {
      setUnreadChat(unreadCounts.chatCount);
      setUnreadMessages(unreadCounts.messageCount);
    }
  }, [unreadCounts]);
  
  // Reset counters when navigating to relevant pages
  useEffect(() => {
    if (location.pathname === '/admin/chat' && unreadChat > 0) {
      setUnreadChat(0);
      // Mark messages as read in database when visiting chat page
      markChatMessagesAsRead();
    }
    
    if (location.pathname === '/admin/messages' && unreadMessages > 0) {
      setUnreadMessages(0);
      // Update contact messages status when visiting messages page
      markContactMessagesAsRead();
    }
  }, [location.pathname]);
  
  // Function to mark chat messages as read
  const markChatMessagesAsRead = async () => {
    try {
      // Get all unread messages
      const { data: unreadMessages, error: fetchError } = await supabase
        .from('chat_messages')
        .select('id')
        .eq('is_admin', false)
        .is('read_at', null);
        
      if (fetchError) throw fetchError;
      
      if (unreadMessages && unreadMessages.length > 0) {
        const unreadIds = unreadMessages.map(msg => msg.id);
        
        // Mark them as read
        const { error: updateError } = await supabase
          .from('chat_messages')
          .update({ read_at: new Date().toISOString() })
          .in('id', unreadIds);
          
        if (updateError) throw updateError;
        
        // Refetch counts
        refetchUnreadCounts();
      }
    } catch (err) {
      console.error("Error marking chat messages as read:", err);
    }
  };
  
  // Function to mark contact messages as read
  const markContactMessagesAsRead = async () => {
    try {
      // Update all 'New' messages to 'Read'
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'Read' })
        .eq('status', 'New');
        
      if (error) throw error;
      
      // Refetch counts
      refetchUnreadCounts();
    } catch (err) {
      console.error("Error marking contact messages as read:", err);
    }
  };
  
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
      <div className="mb-12 mt-2">
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
      
      <div className="flex-1 space-y-6">
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

          <Link 
            to="/admin/supplies"
            className={`flex items-center p-2 rounded transition-colors ${
              isActive('/admin/supplies') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <Package className="mr-3 h-5 w-5 text-gray-600" />
            <span>Supplies</span>
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
            className={`flex items-center justify-between p-2 rounded transition-colors ${
              isActive('/admin/chat') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <MessageCircle className="mr-3 h-5 w-5 text-gray-600" />
              <span>Live Chat</span>
            </div>
            {unreadChat > 0 && (
              <Badge variant="default" className="bg-meow-secondary">{unreadChat}</Badge>
            )}
          </Link>
          
          <Link 
            to="/admin/messages"
            className={`flex items-center justify-between p-2 rounded transition-colors ${
              isActive('/admin/messages') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <Mail className="mr-3 h-5 w-5 text-gray-600" />
              <span>Contact Messages</span>
            </div>
            {unreadMessages > 0 && (
              <Badge variant="default" className="bg-meow-secondary">{unreadMessages}</Badge>
            )}
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
