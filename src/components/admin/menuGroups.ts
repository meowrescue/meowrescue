
import {
  LayoutDashboard,
  PawPrint,
  FileText,
  Calendar,
  Award,
  Users,
  Mail,
  Send,
  MessageSquare,
  DollarSign,
  BarChart,
  Package,
  Truck,
  Folder,
  Clipboard,
  Settings,
  Shield,
  Search,
} from "lucide-react";

// Define a type for our menu items
export type MenuItem = {
  label: string;
  path: string;
  icon: any; // Using any for now as we're storing the icon component reference
};

export type MenuGroup = {
  id: string;
  label: string | null;
  icon?: any;
  items: MenuItem[];
};

// Export the menu groups with icon components references
export const menuGroups: MenuGroup[] = [
  {
    id: "dashboard",
    label: null,
    items: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "animals",
    label: "Animals",
    icon: PawPrint,
    items: [
      {
        label: "Cats",
        path: "/admin/cats",
        icon: PawPrint,
      },
      {
        label: "Applications",
        path: "/admin/applications",
        icon: FileText,
      },
      {
        label: "Lost & Found",
        path: "/admin/lost-found",
        icon: Search,
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    icon: FileText,
    items: [
      {
        label: "Blog",
        path: "/admin/blog",
        icon: FileText,
      },
      {
        label: "Events",
        path: "/admin/events",
        icon: Calendar,
      },
      {
        label: "Success Stories",
        path: "/admin/success-stories",
        icon: Award,
      },
    ],
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    items: [
      {
        label: "User Management",
        path: "/admin/users",
        icon: Users,
      },
      {
        label: "Contact Form",
        path: "/admin/messages",
        icon: Mail,
      },
      {
        label: "Live Chat",
        path: "/admin/chat",
        icon: Send,
      },
      {
        label: "Direct Messages",
        path: "/admin/direct-messages",
        icon: MessageSquare,
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    items: [
      {
        label: "Finances",
        path: "/admin/finance",
        icon: DollarSign,
      },
      {
        label: "Budget Planning",
        path: "/admin/budget",
        icon: BarChart,
      },
      {
        label: "Campaigns",
        path: "/admin/finance/campaigns",
        icon: FileText,
      },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    items: [
      {
        label: "Supplies",
        path: "/admin/supplies",
        icon: Package,
      },
      {
        label: "Orders",
        path: "/admin/orders",
        icon: Truck,
      },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    icon: Folder,
    items: [
      {
        label: "Documents",
        path: "/admin/documents",
        icon: Folder,
      },
      {
        label: "Business Licenses",
        path: "/admin/business-licenses",
        icon: Clipboard,
      },
    ],
  },
  {
    id: "system",
    label: "System",
    icon: Settings,
    items: [
      {
        label: "Security",
        path: "/admin/security",
        icon: Shield,
      },
      {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];
