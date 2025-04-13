import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Search, Edit, UserCog, Shield, UserX, Check } from 'lucide-react';
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
import { User, ExtendedUser } from '@/types/users';

const AdminUsers: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<ExtendedUser | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');

  // Query to get users from profiles table with user_status
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        // Join profiles with user_status to get is_active status
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            user_status (is_active)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data to include is_active
        const extendedUsers = data.map(user => ({
          ...user,
          is_active: user.user_status?.is_active ?? true
        })) as ExtendedUser[];
        
        return extendedUsers;
      } catch (err: any) {
        console.error("Error fetching users:", err);
        throw err;
      }
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
    setNewEmail(user.email);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: newRole as 'user' | 'volunteer' | 'foster' | 'admin',
          email: newEmail,
        })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      // Update user status
      const { error: statusError } = await supabase
        .from('user_status')
        .upsert({
          user_id: editingUser.id,
          is_active: editingUser.is_active
        })
        .select();

      if (statusError) {
        console.error("Error updating active status:", statusError);
      }

      toast({
        title: "User Updated",
        description: `User role has been updated to ${newRole}.`,
      });

      refetch();
      setEditingUser(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (user: ExtendedUser) => {
    try {
      const newStatus = !user.is_active;
      
      const { error } = await supabase
        .from('user_status')
        .upsert({ 
          user_id: user.id, 
          is_active: newStatus 
        })
        .select();

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

  return (
    <AdminLayout title="User Management">
      <SEO title="User Management | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-meow-primary mb-4 md:mb-0">User Management</h1>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-64"
            />
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
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === 'admin' ? 'default' :
                          user.role === 'volunteer' ? 'secondary' :
                          user.role === 'foster' ? 'outline' :
                          'secondary'
                        }
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'default' : 'destructive'}>
                        {user.is_active ? 'Active' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Change the role or email of this user. Be careful with admin privileges.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm">
                Email
              </label>
              <Input
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="col-span-3"
              />
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
