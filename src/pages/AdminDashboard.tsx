
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from './Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Cat, Users, FileText, TrendingUp, Calendar, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard: React.FC = () => {
  // Get counts from Supabase
  const { data: catCount = 0, isLoading: isLoadingCats } = useQuery({
    queryKey: ['cats-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('cats')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: userCount = 0, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: donationTotal = 0, isLoading: isLoadingDonations } = useQuery({
    queryKey: ['donations-total'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('amount');
      
      if (error) throw error;
      
      return data.reduce((sum, donation) => sum + parseFloat(donation.amount.toString()), 0) || 0;
    }
  });

  return (
    <AdminLayout title="Dashboard">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: April 13, 2025</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingDonations ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                `$${donationTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total donations to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Adoptable Cats</CardTitle>
            <Cat className="h-4 w-4 text-meow-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingCats ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                catCount
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total cats in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingUsers ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                userCount
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total registered users</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="adoptions">Adoptions</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 rounded p-2">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Adoption Day</p>
                      <p className="text-sm text-gray-500">April 20, 2025 • 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 rounded p-2">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Volunteer Training</p>
                      <p className="text-sm text-gray-500">April 25, 2025 • 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 rounded p-2">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Fundraising Gala</p>
                      <p className="text-sm text-gray-500">May 5, 2025 • 6:30 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 rounded p-2">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">Applied to adopt Whiskers • 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 rounded p-2">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Michael Smith</p>
                      <p className="text-sm text-gray-500">Applied to adopt Luna • 3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 rounded p-2">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Jessica Brown</p>
                      <p className="text-sm text-gray-500">Applied to adopt Oliver • 5 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="donations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 text-green-600 rounded p-2">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Anonymous Donor</p>
                      <p className="text-sm text-gray-500">April 12, 2025</p>
                    </div>
                  </div>
                  <div className="font-semibold">$250.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 text-green-600 rounded p-2">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-500">April 10, 2025</p>
                    </div>
                  </div>
                  <div className="font-semibold">$100.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 text-green-600 rounded p-2">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-sm text-gray-500">April 8, 2025</p>
                    </div>
                  </div>
                  <div className="font-semibold">$75.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="adoptions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Adoptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-meow-primary/20 text-meow-primary rounded p-2">
                      <Cat className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Mittens</p>
                      <p className="text-sm text-gray-500">Adopted by David Wilson • April 5, 2025</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-meow-primary/20 text-meow-primary rounded p-2">
                      <Cat className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Shadow</p>
                      <p className="text-sm text-gray-500">Adopted by Lisa Chen • April 2, 2025</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-meow-primary/20 text-meow-primary rounded p-2">
                      <Cat className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Cleo</p>
                      <p className="text-sm text-gray-500">Adopted by Robert Johnson • March 28, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="relative z-10 mt-1">
                      <div className="bg-blue-500 text-white rounded-full p-1">
                        <Users className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">New user registered</p>
                      <p className="text-sm text-gray-500">Emily Davis joined • 3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative z-10 mt-1">
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <DollarSign className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Donation received</p>
                      <p className="text-sm text-gray-500">Anonymous donor • $150 • 5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative z-10 mt-1">
                      <div className="bg-amber-500 text-white rounded-full p-1">
                        <Search className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">New lost pet report</p>
                      <p className="text-sm text-gray-500">Lost cat in Parkside neighborhood • 8 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative z-10 mt-1">
                      <div className="bg-meow-primary text-white rounded-full p-1">
                        <Cat className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">New cat added</p>
                      <p className="text-sm text-gray-500">Bella (2 years old) • 12 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
