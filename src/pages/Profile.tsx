
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Pencil, KeyRound, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const { toast } = useToast();

  const editProfileForm = useForm({
    defaultValues: {
      email: user?.email || '',
      name: ''
    }
  });

  const passwordForm = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const handleEditProfile = async (data: any) => {
    try {
      // In a real implementation, we would update the user's profile in Supabase
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePasswordChange = async (data: any) => {
    try {
      if (data.password !== data.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match.",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
      setIsPasswordOpen(false);
      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // This is a placeholder - in a real implementation, we would delete the user's account from Supabase
      // For security reasons, Supabase doesn't provide a client-side method to delete users
      // This would typically be handled through an Edge Function
      
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted. You will be signed out.",
      });
      
      // Sign out the user after account deletion
      setTimeout(() => {
        signOut();
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-6 text-meow-primary">My Profile</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="applications">Adoption Applications</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              {/* More tabs can be added here based on user role */}
            </TabsList>
            
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>Your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <User size={40} className="text-gray-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-lg">{user?.email}</h3>
                      <p className="text-gray-500 text-sm">Member since {new Date(user?.created_at || '').toLocaleDateString()}</p>
                      
                      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                          <Button className="mt-4 bg-meow-primary hover:bg-meow-primary/90">
                            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                              Update your profile information below.
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...editProfileForm}>
                            <form onSubmit={editProfileForm.handleSubmit(handleEditProfile)} className="space-y-4">
                              <FormField
                                control={editProfileForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editProfileForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Your name" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button type="submit">Save changes</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Manage your account information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
                        <p>{user?.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">User ID</h4>
                        <p className="text-sm truncate">{user?.id}</p>
                      </div>
                      <div className="pt-6 flex flex-wrap gap-4">
                        <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center">
                              <KeyRound className="mr-2 h-4 w-4" /> Change Password
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change Password</DialogTitle>
                              <DialogDescription>
                                Enter your new password below.
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...passwordForm}>
                              <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                                <FormField
                                  control={passwordForm.control}
                                  name="password"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>New Password</FormLabel>
                                      <FormControl>
                                        <Input type="password" {...field} placeholder="New password" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={passwordForm.control}
                                  name="confirmPassword"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Confirm Password</FormLabel>
                                      <FormControl>
                                        <Input type="password" {...field} placeholder="Confirm new password" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <DialogFooter>
                                  <Button type="submit">Change Password</Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="flex items-center">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteAccount}>
                                Delete Account
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Your Adoption Applications</CardTitle>
                  <CardDescription>Track the status of your adoption applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <p className="text-gray-500">You haven't submitted any adoption applications yet.</p>
                    <Button asChild className="mt-4 bg-meow-primary hover:bg-meow-primary/90">
                      <a href="/cats">Browse Adoptable Cats</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="donations">
              <Card>
                <CardHeader>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>Review your previous donations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <p className="text-gray-500">You haven't made any donations yet.</p>
                    <Button asChild className="mt-4 bg-meow-secondary hover:bg-meow-secondary/90">
                      <a href="/donate">Make a Donation</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Profile;
