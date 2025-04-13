import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CheckCheck, Copy, User, UserPlus, UserRoundCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

const AdminUsers: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin' | 'volunteer' | 'foster'>('user');
  
  // Fetch users
  const { data: users, isLoading, error, refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as User[];
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    }
  });
  
  // Filter users based on search query
  const filteredUsers = users?.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingUser(null);
  };
  
  // Handle update user
  const handleUpdateUser = async (user: Partial<User>) => {
    try {
      // Make sure role is properly typed as a valid app_role
      let userToUpdate = { ...user };
      
      if (userToUpdate.role) {
        // Cast the role to one of the allowed values
        userToUpdate.role = userToUpdate.role as "user" | "admin" | "volunteer" | "foster";
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(userToUpdate)
        .eq('id', user.id as string);
        
      if (error) throw error;
      
      toast({
        title: 'User Updated',
        description: 'User information has been updated successfully.'
      });
      
      setEditingUser(null);
      refetchUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user.',
        variant: 'destructive'
      });
    }
  };
  
  // Handle create user
  const handleCreateUser = async () => {
    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: newUserEmail,
        password: 'defaultpassword', // You might want to generate a random password
        options: {
          data: {
            role: newUserRole,
          }
        }
      });
      
      if (error) throw error;
      
      // Create user profile in 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user?.id,
            email: newUserEmail, 
            role: newUserRole 
          }
        ]);
      
      if (profileError) throw profileError;
      
      toast({
        title: 'User Created',
        description: 'New user has been created successfully.'
      });
      
      setIsCreateUserOpen(false);
      setNewUserEmail('');
      setNewUserRole('user');
      refetchUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user.',
        variant: 'destructive'
      });
    }
  };
  
  // Handle copy user ID
  const handleCopyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId);
    toast({
      title: 'User ID Copied',
      description: 'User ID has been copied to clipboard.'
    });
  };

  return (
    <AdminLayout title="Users">
      <SEO title="Users | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Users</h1>
          <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Create a new user account and assign a role.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input 
                    type="email" 
                    id="email" 
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select value={newUserRole} onValueChange={value => setNewUserRole(value as "user" | "admin" | "volunteer" | "foster")}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                      <SelectItem value="foster">Foster</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading users. Please try again later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of all users in the system.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.first_name || '-'}</TableCell>
                    <TableCell>{user.last_name || '-'}</TableCell>
                    <TableCell>
                      <Badge className="bg-gray-100 text-gray-800">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopyUserId(user.id)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy ID
                        </Button>
                        {editingUser?.id === user.id ? (
                          <>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleUpdateUser({ 
                                id: user.id,
                                first_name: editingUser.first_name,
                                last_name: editingUser.last_name,
                                role: editingUser.role
                              })}
                            >
                              <CheckCheck className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <UserRoundCog className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Edit User Dialog (Conditionally rendered) */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Make changes to the user's information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input 
                  type="email" 
                  id="email" 
                  defaultValue={editingUser.email} 
                  disabled
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_name" className="text-right">
                  First Name
                </Label>
                <Input 
                  type="text" 
                  id="first_name" 
                  value={editingUser.first_name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last_name" className="text-right">
                  Last Name
                </Label>
                <Input 
                  type="text" 
                  id="last_name" 
                  value={editingUser.last_name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select value={editingUser.role} onValueChange={value => setEditingUser({ ...editingUser, role: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="foster">Foster</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdateUser({ 
                id: editingUser.id,
                first_name: editingUser.first_name,
                last_name: editingUser.last_name,
                role: editingUser.role
              })}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
