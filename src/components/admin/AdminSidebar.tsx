
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, Users, FileText, Calendar, PawPrint, 
  DollarSign, Settings, Shield, MessageSquare, Search,
  Package, CircleHelp, Send, BookOpen, Bell, ChevronDown,
  FileImage, Folder, Award, CreditCard, Receipt, Mail,
  LogOut, Home, Boxes, FileSpreadsheet, Truck, Clipboard,
  Building, BarChart, Image, Globe, LayoutList, Cat
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [menuExpanded, setMenuExpanded] = useState<Record<string, boolean>>({
    content: true,
    animals: true,
    finance: true,
    users: true,
    system: true
  });
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleMenu = (menu: string) => {
    setMenuExpanded(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.first_name && !user?.last_name) return 'U';
    
    const firstInitial = user?.first_name ? user.first_name.charAt(0) : '';
    const lastInitial = user?.last_name ? user.last_name.charAt(0) : '';
    
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const menuGroups = [
    {
      id: 'dashboard',
      items: [
        { 
          to: '/admin', 
          icon: <LayoutDashboard className="w-5 h-5" />, 
          label: 'Dashboard',
          exact: true
        }
      ]
    },
    {
      id: 'animals',
      label: 'Animals',
      icon: <PawPrint className="w-5 h-5" />,
      items: [
        { 
          to: '/admin/cats', 
          icon: <PawPrint className="w-5 h-5" />, 
          label: 'Cats'
        },
        { 
          to: '/admin/applications', 
          icon: <FileText className="w-5 h-5" />, 
          label: 'Applications'
        },
        { 
          to: '/admin/lost-found', 
          icon: <Search className="w-5 h-5" />, 
          label: 'Lost & Found'
        }
      ]
    },
    {
      id: 'content',
      label: 'Content',
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        { 
          to: '/admin/blog', 
          icon: <BookOpen className="w-5 h-5" />, 
          label: 'Blog'
        },
        { 
          to: '/admin/events', 
          icon: <Calendar className="w-5 h-5" />, 
          label: 'Events'
        },
        { 
          to: '/admin/team', 
          icon: <Users className="w-5 h-5" />, 
          label: 'Team'
        },
        { 
          to: '/admin/success-stories', 
          icon: <Award className="w-5 h-5" />, 
          label: 'Success Stories'
        },
        { 
          to: '/admin/pages', 
          icon: <LayoutList className="w-5 h-5" />, 
          label: 'Pages'
        }
      ]
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users className="w-5 h-5" />,
      items: [
        { 
          to: '/admin/users', 
          icon: <Users className="w-5 h-5" />, 
          label: 'User Management'
        },
        { 
          to: '/admin/messages', 
          icon: <Mail className="w-5 h-5" />, 
          label: 'Contact Form'
        },
        { 
          to: '/admin/chat', 
          icon: <Send className="w-5 h-5" />, 
          label: 'Live Chat'
        },
        { 
          to: '/admin/direct-messages', 
          icon: <MessageSquare className="w-5 h-5" />, 
          label: 'Direct Messages'
        }
      ]
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: <DollarSign className="w-5 h-5" />,
      items: [
        { 
          to: '/admin/finance/donations', 
          icon: <DollarSign className="w-5 h-5" />, 
          label: 'Donations'
        },
        { 
          to: '/admin/finance/income', 
          icon: <CreditCard className="w-5 h-5" />, 
          label: 'Income'
        },
        { 
          to: '/admin/finance/expenses', 
          icon: <Receipt className="w-5 h-5" />, 
          label: 'Expenses'
        }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package className="w-5 h-5" />,
      items: [
        { 
          to: '/admin/supplies', 
          icon: <Package className="w-5 h-5" />, 
          label: 'Supplies'
        },
        { 
          to: '/admin/orders', 
          icon: <Truck className="w-5 h-5" />, 
          label: 'Orders'
        }
      ]
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <Folder className="w-5 h-5" />,
      items: [
        { 
          to: '/admin/documents', 
          icon: <Folder className="w-5 h-5" />, 
          label: 'Documents'
        },
        { 
          to: '/admin/business-licenses', 
          icon: <Clipboard className="w-5 h-5" />, 
          label: 'Business Licenses'
        }
      ]
    },
    {
      id: 'system',
      label: 'System',
      icon: <Settings className="w-5 h-5" />,
      items: [
        { 
          to: '/admin/security', 
          icon: <Shield className="w-5 h-5" />, 
          label: 'Security'
        },
        { 
          to: '/admin/analytics', 
          icon: <BarChart className="w-5 h-5" />, 
          label: 'Analytics'
        },
        { 
          to: '/admin/help', 
          icon: <CircleHelp className="w-5 h-5" />, 
          label: 'Help & Support'
        }
      ]
    }
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r z-40 shadow-md">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-meow-primary rounded-full p-1">
            <Cat className="h-5 w-5 text-white" />
          </div>
          <span>
            <span className="text-meow-primary font-bold">Meow</span>
            <span className="text-meow-secondary font-bold">Rescue</span>
          </span>
        </div>
      </div>
      
      <div className="pt-4 border-b border-gray-200 pb-4">
        <div className="px-4 flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={user?.avatar_url || ''} alt={user?.first_name || 'User'} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
      
      <div className="py-4 px-3 overflow-y-auto max-h-[calc(100vh-180px)] pb-32">
        <ul className="space-y-1">
          {menuGroups.map((group) => (
            <li key={group.id} className="mb-2">
              {group.label ? (
                <>
                  <button
                    className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
                    onClick={() => toggleMenu(group.id)}
                  >
                    {group.icon}
                    <span className="ml-3">{group.label}</span>
                    <ChevronDown 
                      className={`w-4 h-4 ml-auto transform transition-transform ${menuExpanded[group.id] ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  <ul className={`space-y-1 py-1 ${menuExpanded[group.id] ? 'block' : 'hidden'}`}>
                    {group.items.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          className={`flex items-center p-2 pl-9 text-sm text-gray-600 rounded-lg hover:bg-gray-100 ${
                            isActive(item.to) ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''
                          }`}
                          end={item.exact}
                        >
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                          {item.label === 'Live Chat' && user?.unread_chat_count ? (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {user.unread_chat_count > 99 ? '99+' : user.unread_chat_count}
                            </span>
                          ) : null}
                          {item.label === 'Contact Form' && user?.unread_message_count ? (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {user.unread_message_count > 99 ? '99+' : user.unread_message_count}
                            </span>
                          ) : null}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${
                          isActive(item.to) ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''
                        }`}
                        end={item.exact}
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        
        <div className="pt-4 mt-6 border-t border-gray-200 space-y-2">
          <NavLink 
            to="/" 
            className="flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <Home className="w-5 h-5" />
            <span className="ml-3">Back to Site</span>
          </NavLink>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
