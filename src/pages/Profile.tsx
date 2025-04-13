
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

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
                      <Button className="mt-4 bg-meow-primary hover:bg-meow-primary/90">Edit Profile</Button>
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
                      <div className="pt-4">
                        <Button variant="outline" className="mr-2">Change Password</Button>
                        <Button variant="destructive">Delete Account</Button>
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
