import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  PawPrint,
  DollarSign,
  Settings,
  Shield,
  MessageSquare,
  Search,
  Package,
  HelpCircle,      // ← renamed from CircleHelp
  Send,
  BookOpen,
  Bell,
  ChevronDown,
  Image,           // ← FileImage → Image
  Folder,
  Award,
  CreditCard,
  Receipt,
  Mail,
  LogOut,
  Home,
  Boxes,
  FileSpreadsheet,
  Truck,
  Clipboard,
} from 'lucide-react';

import Logo from '@/components/Logo';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Adoptions', path: '/admin/adoptions', icon: PawPrint },
  { label: 'Cats', path: '/admin/cats', icon: Boxes },
  { label: 'People', path: '/admin/people', icon: Users },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Blog Posts', path: '/admin/posts', icon: FileText },
  { label: 'Resources', path: '/admin/resources', icon: BookOpen },
  { label: 'Inbox', path: '/admin/inbox', icon: Mail },
  { label: 'Media', path: '/admin/media', icon: Image },
  { label: 'Finance', path: '/admin/finance', icon: DollarSign },
  { label: 'Inventory', path: '/admin/inventory', icon: Package },
  { label: 'Vendors', path: '/admin/vendors', icon: Truck },
  { label: 'Reports', path: '/admin/reports', icon: FileSpreadsheet },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
  { label: 'Help', path: '/admin/help', icon: HelpCircle },   // ← updated
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white dark:bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Meow Rescue</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {navItems.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={classNames(
              'mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800',
              location.pathname.startsWith(path)
                ? 'bg-gray-100 text-primary dark:bg-gray-800'
                : 'text-gray-700 dark:text-gray-300'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Utilities */}
      <div className="border-t p-4">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
          <Search className="h-4 w-4" />
          Quick Search
        </button>

        <button className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell className="h-4 w-4" />
          Notifications
          <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white">
            3
          </span>
          <ChevronDown className="h-3 w-3" />
        </button>

        <button className="mt-6 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-gray-800">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
