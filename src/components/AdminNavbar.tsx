
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { 
  Home,
  Cat,
  Users,
  DollarSign,
  MessageSquare,
  Calendar,
  Search,
  BarChart3,
  ShieldCheck,
  LogOut,
  Bell,
  PenSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const getInitials = () => {
    const firstName = user?.user_metadata?.first_name || '';
    const lastName = user?.user_metadata?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b mb-0 pb-0">
        <div className="flex items-center p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-meow-primary rounded-full p-2">
              <Cat className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl">
                <span className="text-meow-primary">Meow</span>
                <span className="text-meow-secondary">Rescue</span>
              </span>
              <span className="text-xs block text-gray-500">Admin Dashboard</span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/admin') && location.pathname === '/admin' ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''}>
                  <Link to="/admin">
                    <Home size={18} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/admin/cats') ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''}>
                  <Link to="/admin/cats">
                    <Cat size={18} />
                    <span>Cats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/admin/users') ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''}>
                  <Link to="/admin/users">
                    <Users size={18} />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/admin/finance') ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''}>
                  <Link to="/admin/finance">
                    <DollarSign size={18} />
                    <span>Finance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/admin/forum') ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''}>
                  <Link to="/admin/forum">
                    <MessageSquare size={18} />
                    <span>Forum</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/admin/blog') ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''}>
                  <Link to="/admin/blog">
                    <PenSquare size={18} />
                    <span>Blog</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/admin/events') ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''}>
                  <Link to="/admin/events">
                    <Calendar size={18} />
                    <span>Events</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/admin/lost-found') ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''}>
                  <Link to="/admin/lost-found">
                    <Search size={18} />
                    <span>Lost & Found</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/admin/analytics') ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''}>
                  <Link to="/admin/analytics">
                    <BarChart3 size={18} />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/admin/security') ? 'bg-meow-primary/10 text-meow-primary font-medium' : ''}>
                  <Link to="/admin/security">
                    <ShieldCheck size={18} />
                    <span>Security</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t mt-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.user_metadata?.first_name || user?.email}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signOut()}
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminNavbar;
