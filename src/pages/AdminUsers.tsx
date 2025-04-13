
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Search, Edit, UserCog, Shield, UserX, Check, Filter, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { ExtendedUser } from '@/types/users';

const AdminUsers: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingUser, setEditingUser] = useState<ExtendedUser | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [newFirstName, setNewFirstName] = useState<string>('');
  const [newLastName, setNewLastName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');

  // Query to get users from profiles table with enhanced filtering
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users', roleFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*');

      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }

      if (statusFilter === 'active') {
        query = query.eq('is_active', true);
      } else if (statusFilter === 'disabled') {
        query = query.eq('is_active', false);
      }

      const { data: profilesData, error: profilesError } = await query;
      
      if (profilesError) throw profilesError;
        
        // Get is_active status for each user
        const extendedUsers = await Promise.all(
          profilesData.map(async (profile) => {
            let isActive = true; // Default to active if not found
            
            try {
              // Use type assertion to bypass TypeScript's strict checking
              const { data: statusData, error: statusError } = await supabase
                .rpc('get_user_status' as any, { user_id: profile.id }) as { data: boolean | null, error: Error | null };
                
              // If data is returned and not null, use it
              if (statusData !== null) {
                isActive = statusData;
              }
            } catch (err) {
              console.error(`Error fetching status for user ${profile.id}:`, err);
            }
            
            return {
              ...profile,
              is_active: isActive
            } as ExtendedUser;
          })
        );
        
        return extendedUsers;
    }
  });

  // Filter users based on search query
  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditUser = (user: ExtendedUser) => {
    setEditingUser(user);
    setNewRole(user.role);
    setNewFirstName(user.first_name || '');
    setNewLastName(user.last_name || '');
    setNewEmail(user.email);
    setNewPhone(user.phone || '');
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: newRole as 'user' | 'volunteer' | 'foster' | 'admin',
          first_name: newFirstName,
          last_name: newLastName,
          email: newEmail,
          phone: newPhone,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      toast({
        title: "User Updated",
        description: `User details have been updated successfully.`,
      });

      refetch();
      setEditingUser(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update user details.",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (user: ExtendedUser) => {
    try {
      // Optimistically update the UI
      const newStatus = !user.is_active;

      // Call the RPC function to update user status
      const { error } = await supabase.rpc('update_user_status', {
        p_user_id: user.id,
        p_is_active: newStatus,
      });

      if (error) throw error;

      toast({
        title: newStatus ? "User Enabled" : "User Disabled",
        description: `User has been ${newStatus ? "enabled" : "disabled"} successfully.`,
      });

      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update user status.",
        variant: "destructive",
      });
    }
  };

  // Get role badge color
  const getRoleBadgeVariant = (role: string) => {
    switch(role) {
      case 'admin':
        return "destructive";
      case 'volunteer':
        return "secondary";
      case 'foster':
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <AdminLayout title="User Management">
      <SEO title="User Management | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-meow-primary mb-4 md:mb-0">User Management</h1>
          
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            
            <Select 
              value={roleFilter} 
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="foster">Foster</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading users. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredUsers && filteredUsers.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <Table>
              <TableCaption>List of all users in the system.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className={!user.is_active ? "opacity-60" : ""}>
                    <TableCell>
                      {user.first_name || user.last_name 
                        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                        : 'Unnamed User'
                      }
                    </TableCell>
                    <TableCell className="break-all md:break-normal">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'default' : 'destructive'}>
                        {user.is_active ? 'Active' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col md:flex-row gap-2 md:justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleUserStatus(user)}
                          className={user.is_active ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"}
                        >
                          {user.is_active ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Disable
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Enable
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </div>
      
      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
            <DialogDescription>
              Update user information and permissions. Be careful with admin privileges.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="firstName" className="text-right text-sm">
                First Name
              </label>
              <div className="col-span-3">
                <Input
                  id="firstName"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lastName" className="text-right text-sm">
                Last Name
              </label>
              <div className="col-span-3">
                <Input
                  id="lastName"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm">
                Email
              </label>
              <div className="col-span-3">
                <Input
                  id="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Email Address"
                  type="email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right text-sm">
                Phone
              </label>
              <div className="col-span-3">
                <Input
                  id="phone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Phone Number"
                  type="tel"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-right text-sm">
                Role
              </label>
              <div className="col-span-3">
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="foster">Foster</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
