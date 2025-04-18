
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, UserPlus, AlertTriangle, LogIn, LogOut, Lock, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import SEO from '@/components/SEO';

interface ActivityLog {
  id: string;
  activity_type: string;
  description: string;
  user_id: string | null;
  created_at: string;
  metadata: any;
  user?: {
    email: string;
  };
}

const AdminSecurity = () => {
  const [activityLimit, setActivityLimit] = useState(10);

  // Fetch activity logs
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ['activity-logs', activityLimit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(activityLimit);
      
      if (error) throw error;
      return data as ActivityLog[];
    }
  });

  // Helper function to get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <LogIn className="h-5 w-5 text-blue-500" />;
      case 'logout':
        return <LogOut className="h-5 w-5 text-gray-500" />;
      case 'create':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'update':
        return <Shield className="h-5 w-5 text-yellow-500" />;
      case 'delete':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Lock className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <AdminLayout title="Security">
      <SEO title="Security | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-meow-primary mb-6">Security Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Authentication Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Password Requirements</h3>
                  <ul className="list-disc list-inside mt-2 text-gray-600">
                    <li>Minimum 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-gray-600 mt-1">
                    Enhanced security for admin accounts is enabled by default.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Session Management</h3>
                  <p className="text-gray-600 mt-1">
                    Sessions expire after 7 days of inactivity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">User Roles</h3>
                  <ul className="list-disc list-inside mt-2 text-gray-600">
                    <li><strong>Admin:</strong> Full access to all features</li>
                    <li><strong>Staff:</strong> Limited admin access</li>
                    <li><strong>Foster:</strong> Access to foster-specific features</li>
                    <li><strong>Volunteer:</strong> Access to volunteer resources</li>
                    <li><strong>User:</strong> Basic access to public features</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Permission Hierarchy</h3>
                  <p className="text-gray-600 mt-1">
                    Higher roles inherit permissions from lower roles automatically.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : activityLogs && activityLogs.length > 0 ? (
              <>
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start border-b pb-4">
                      <div className="mr-4 mt-1">
                        {getActivityIcon(log.activity_type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {log.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 mt-1 text-sm text-gray-500">
                          <span>
                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                          </span>
                          {log.user && (
                            <span>by {log.user.email}</span>
                          )}
                          <span className="capitalize bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                            {log.activity_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setActivityLimit(prev => prev + 10)}
                    className="w-full"
                  >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Load More
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center py-6 text-gray-500">
                No recent activity logs found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
