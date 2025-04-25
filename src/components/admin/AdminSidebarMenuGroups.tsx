
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, Calendar, PawPrint, DollarSign, Settings, Shield, 
  MessageSquare, Search, Package, Send, BookOpen, Award, Mail, Cat, Users, Truck, 
  Folder, Clipboard, BarChart
} from "lucide-react";

interface AdminSidebarMenuGroupsProps {
  user?: { unread_chat_count?: number; unread_message_count?: number };
  isActive: (path: string) => boolean;
}

const menuGroups = [
  {
    id: 'dashboard',
    label: null,
    items: [
      { 
        to: '/admin/dashboard', 
        icon: <LayoutDashboard className="w-5 h-5" />, 
        label: 'Dashboard'
      }
    ]
  },
  {
    id: 'animals',
    label: 'ANIMALS',
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
    label: 'CONTENT',
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
        to: '/admin/success-stories', 
        icon: <Award className="w-5 h-5" />, 
        label: 'Success Stories'
      }
    ]
  },
  {
    id: 'users',
    label: 'USERS',
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
    label: 'FINANCE',
    items: [
      {
        to: '/admin/finance',
        icon: <DollarSign className="w-5 h-5" />,
        label: 'Finances'
      },
      {
        to: '/admin/budget',
        icon: <BarChart className="w-5 h-5" />,
        label: 'Budget Planning'
      },
      {
        to: '/admin/finance/campaigns',
        icon: <FileText className="w-5 h-5" />,
        label: 'Campaigns'
      }
    ]
  },
  {
    id: 'inventory',
    label: 'INVENTORY',
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
    label: 'DOCUMENTS',
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
    label: 'SYSTEM',
    items: [
      { 
        to: '/admin/security', 
        icon: <Shield className="w-5 h-5" />, 
        label: 'Security'
      },
      { 
        to: '/admin/settings', 
        icon: <Settings className="w-5 h-5" />,
        label: 'Settings'
      }
    ]
  }
];

const AdminSidebarMenuGroups: React.FC<AdminSidebarMenuGroupsProps> = ({ user, isActive }) => (
  <>
    {menuGroups.map((group) => (
      <React.Fragment key={group.id}>
        {group.label && (
          <li className="mt-4 mb-1 px-2">
            <span className="uppercase tracking-widest text-xs font-semibold text-gray-400">
              {group.label}
            </span>
          </li>
        )}
        {group.items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={`flex items-center p-2 text-base text-gray-700 rounded-lg transition-colors hover:bg-gray-100 font-medium ${
                isActive(item.to) ? 'bg-meow-primary/10 text-meow-primary font-bold' : ''
              }`}
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
      </React.Fragment>
    ))}
  </>
);

export default AdminSidebarMenuGroups;
