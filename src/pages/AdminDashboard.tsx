
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chat, User, Cat, Calendar, DollarSign, FileText, Info, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Application } from '@/types/applications';

// Dashboard component for admin users
const AdminDashboard: React.FC = () => {
  // Fetch recent applications
  const { data: recentApplications } = useQuery({
    queryKey: ['recent-applications'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        return data as Application[];
      } catch (error) {
        console.error("Error fetching recent applications:", error);
        return [] as Application[];
      }
    }
  });

  // Fetch recent contact messages
  const { data: recentMessages } = useQuery({
    queryKey: ['recent-messages'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('received_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        return data;
      } catch (error) {
        console.error("Error fetching recent messages:", error);
        return [];
      }
    }
  });

  // Fetch recent activity logs
  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*, profiles:user_id(first_name, last_name)')
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        return data;
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        return [];
      }
    }
  });

  // Fetch total counts
  const { data: counts } = useQuery({
    queryKey: ['dashboard-counts'],
    queryFn: async () => {
      try {
        // Get cats count
        const { count: catsCount, error: catsError } = await supabase
          .from('cats')
          .select('*', { count: 'exact', head: true });
          
        if (catsError) throw catsError;
        
        // Get users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        
        // Get applications count
        const { count: applicationsCount, error: applicationsError } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true });
          
        if (applicationsError) throw applicationsError;
        
        // Get pending applications count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
          
        if (pendingError) throw pendingError;
        
        return {
          cats: catsCount || 0,
          users: usersCount || 0,
          applications: applicationsCount || 0,
          pending: pendingCount || 0
        };
      } catch (error) {
        console.error("Error fetching counts:", error);
        return { cats: 0, users: 0, applications: 0, pending: 0 };
      }
    }
  });

  return (
    <AdminLayout title="Dashboard">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-meow-primary mb-8">Dashboard</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Cats</p>
                  <h3 className="text-2xl font-bold">{counts?.cats || 0}</h3>
                </div>
                <div className="h-12 w-12 bg-meow-light/20 rounded-full flex items-center justify-center">
                  <Cat className="h-6 w-6 text-meow-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold">{counts?.users || 0}</h3>
                </div>
                <div className="h-12 w-12 bg-meow-light/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-meow-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Applications</p>
                  <h3 className="text-2xl font-bold">{counts?.applications || 0}</h3>
                </div>
                <div className="h-12 w-12 bg-meow-light/20 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-meow-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Applications</p>
                  <h3 className="text-2xl font-bold">{counts?.pending || 0}</h3>
                </div>
                <div className="h-12 w-12 bg-meow-light/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <Link to="/admin/cats/new">
                <Cat className="h-6 w-6" />
                <span>Add Cat</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <Link to="/admin/blog/new">
                <FileText className="h-6 w-6" />
                <span>New Blog Post</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <Link to="/admin/events">
                <Calendar className="h-6 w-6" />
                <span>Manage Events</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <Link to="/admin/finance">
                <DollarSign className="h-6 w-6" />
                <span>Record Donation</span>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Recent Activity and Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Recent Applications</span>
                <Button asChild variant="link" size="sm" className="text-meow-primary">
                  <Link to="/admin/applications">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentApplications && recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {app.form_data.firstName} {app.form_data.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {app.application_type} Application
                          </p>
                        </div>
                        <div>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            app.status === 'approved' ? 'bg-green-100 text-green-800' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            app.status === 'in-review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {app.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No recent applications</p>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity: any) => (
                    <div key={activity.id} className="border-b pb-2 last:border-0">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Info className="h-4 w-4 text-meow-primary" />
                        </div>
                        <div>
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {activity.profiles ? `${activity.profiles.first_name} ${activity.profiles.last_name}` : 'System'} • {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
