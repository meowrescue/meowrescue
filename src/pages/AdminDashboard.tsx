
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from './Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Cat, Users, FileText, TrendingUp, Calendar, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

const AdminDashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Set current date in format like "April 13, 2025"
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

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

  // Recent events
  const { data: events = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['recent-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date_start', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Recent applications
  const { data: applications = [], isLoading: isLoadingApplications } = useQuery({
    queryKey: ['recent-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adoption_applications')
        .select('*, cats(*), profiles(*)')
        .order('submitted_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Recent donations
  const { data: recentDonations = [], isLoading: isLoadingRecentDonations } = useQuery({
    queryKey: ['recent-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*, profiles(*)')
        .order('donation_date', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Recent adoptions
  const { data: adoptions = [], isLoading: isLoadingAdoptions } = useQuery({
    queryKey: ['recent-adoptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*, cats(*)')
        .order('adoption_date', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Recent lost & found
  const { data: lostFoundPosts = [], isLoading: isLoadingLostFound } = useQuery({
    queryKey: ['recent-lost-found'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lost_found_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <AdminLayout title="Dashboard">
      <SEO title="Dashboard | Meow Rescue Admin" />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {currentDate}</div>
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
                {isLoadingEvents ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
                  </div>
                ) : events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="flex items-start gap-4">
                        <div className="bg-gray-100 rounded p-2">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.event_date_start).toLocaleDateString()} • 
                            {new Date(event.event_date_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No upcoming events</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingApplications ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
                  </div>
                ) : applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map(app => (
                      <div key={app.id} className="flex items-start gap-4">
                        <div className="bg-gray-100 rounded p-2">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {app.profiles?.first_name} {app.profiles?.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied to adopt {app.cats?.name} • 
                            {new Date(app.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No adoption applications yet</p>
                )}
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
              {isLoadingRecentDonations ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
                </div>
              ) : recentDonations.length > 0 ? (
                <div className="space-y-4">
                  {recentDonations.map(donation => (
                    <div key={donation.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 text-green-600 rounded p-2">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {donation.profiles ? 
                              `${donation.profiles.first_name || ''} ${donation.profiles.last_name || ''}`.trim() : 
                              'Anonymous Donor'}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(donation.donation_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="font-semibold">
                        ${parseFloat(donation.amount.toString()).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No donations received yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="adoptions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Adoptions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAdoptions ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
                </div>
              ) : adoptions.length > 0 ? (
                <div className="space-y-4">
                  {adoptions.map(adoption => (
                    <div key={adoption.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-meow-primary/20 text-meow-primary rounded p-2">
                          <Cat className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{adoption.cats?.name}</p>
                          <p className="text-sm text-gray-500">
                            Adopted • {adoption.adoption_date ? 
                              new Date(adoption.adoption_date).toLocaleDateString() : 
                              'Date not recorded'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No adoptions recorded yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingUsers || isLoadingDonations || isLoadingLostFound ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
                  <div className="space-y-6">
                    {recentDonations.length > 0 && (
                      <div className="flex gap-4">
                        <div className="relative z-10 mt-1">
                          <div className="bg-green-500 text-white rounded-full p-1">
                            <DollarSign className="h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Donation received</p>
                          <p className="text-sm text-gray-500">
                            {recentDonations[0].profiles ? 
                              `${recentDonations[0].profiles.first_name || ''} ${recentDonations[0].profiles.last_name || ''}`.trim() : 
                              'Anonymous donor'} • 
                            ${parseFloat(recentDonations[0].amount.toString()).toFixed(2)} • 
                            {new Date(recentDonations[0].donation_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {lostFoundPosts.length > 0 && (
                      <div className="flex gap-4">
                        <div className="relative z-10 mt-1">
                          <div className="bg-amber-500 text-white rounded-full p-1">
                            <Search className="h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">New {lostFoundPosts[0].status} pet report</p>
                          <p className="text-sm text-gray-500">
                            {lostFoundPosts[0].title} • {lostFoundPosts[0].location} • 
                            {new Date(lostFoundPosts[0].created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {applications.length > 0 && (
                      <div className="flex gap-4">
                        <div className="relative z-10 mt-1">
                          <div className="bg-blue-500 text-white rounded-full p-1">
                            <Users className="h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">New adoption application</p>
                          <p className="text-sm text-gray-500">
                            For {applications[0].cats?.name} • 
                            {new Date(applications[0].submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {applications.length === 0 && recentDonations.length === 0 && lostFoundPosts.length === 0 && (
                      <p className="text-center py-4 text-gray-500">No recent activity</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
