
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, Users, FileText, Calendar, PawPrint, 
  DollarSign, Settings, Shield, MessageSquare, Search,
  Package, CircleHelp, Send, BookOpen, Bell, ChevronDown,
  FileImage, Folder, Award
} from 'lucide-react';

const AdminSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [menuExpanded, setMenuExpanded] = React.useState<Record<string, boolean>>({
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
          to: '/admin/pages', 
          icon: <FileText className="w-5 h-5" />, 
          label: 'Pages'
        },
        { 
          to: '/admin/team', 
          icon: <Users className="w-5 h-5" />, 
          label: 'Team'
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
          icon: <MessageSquare className="w-5 h-5" />, 
          label: 'Contact Form'
        },
        { 
          to: '/admin/chat', 
          icon: <Send className="w-5 h-5" />, 
          label: 'Live Chat'
        }
      ]
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: <DollarSign className="w-5 h-5" />,
      items: [
        { 
          to: '/admin/finance', 
          icon: <DollarSign className="w-5 h-5" />, 
          label: 'Finance'
        },
        { 
          to: '/admin/supplies', 
          icon: <Package className="w-5 h-5" />, 
          label: 'Supplies'
        },
        { 
          to: '/admin/documents', 
          icon: <Folder className="w-5 h-5" />, 
          label: 'Documents'
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
          to: '/admin/help', 
          icon: <CircleHelp className="w-5 h-5" />, 
          label: 'Help & Support'
        }
      ]
    }
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r z-40 pt-16 shadow-md">
      <div className="py-4 px-3 overflow-y-auto max-h-screen pb-20">
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
      </div>
    </div>
  );
};

export default AdminSidebar;
