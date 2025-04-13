
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock, User, Shield, Activity } from 'lucide-react';
import SEO from '@/components/SEO';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface ActivityLog {
  id: string;
  user_id: string;
  description: string;
  activity_type: string;
  created_at: string;
  ip_address: string | null;
  metadata: any | null;
  profiles?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
  };
}

const AdminSecurity: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Fetch activity logs
  const { data: activityLogs, isLoading, error, refetch } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('activity_logs')
          .select(`
            *,
            profiles:user_id(email, first_name, last_name, role)
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        return data as ActivityLog[];
      } catch (err: any) {
        console.error("Error fetching activity logs:", err);
        toast({
          title: "Error fetching activity logs",
          description: err.message || "Failed to load activity logs",
          variant: "destructive"
        });
        return [] as ActivityLog[];
      }
    }
  });

  // Filter logs based on search query
  const filteredLogs = activityLogs?.filter(log =>
    log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.activity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.profiles?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActivityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'login': return 'bg-green-100 text-green-800';
      case 'logout': return 'bg-yellow-100 text-yellow-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'create': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Count logs by type for the overview
  const countByType: Record<string, number> = {};
  activityLogs?.forEach(log => {
    const type = log.activity_type.toLowerCase();
    countByType[type] = (countByType[type] || 0) + 1;
  });

  // Recent login activity
  const recentLogins = activityLogs?.filter(log => 
    log.activity_type.toLowerCase() === 'login'
  ).slice(0, 5);

  return (
    <AdminLayout title="Security & Logs">
      <SEO title="Security & Logs | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-meow-primary">Security & Activity Logs</h1>
          <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activity logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Activity Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium flex items-center">
                <Activity className="mr-2 h-5 w-5 text-meow-primary" />
                Total Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activityLogs?.length || 0}</div>
              <p className="text-sm text-gray-500 mt-1">All recorded actions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium flex items-center">
                <User className="mr-2 h-5 w-5 text-meow-primary" />
                Login Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{countByType['login'] || 0}</div>
              <p className="text-sm text-gray-500 mt-1">User sign-ins</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="mr-2 h-5 w-5 text-meow-primary" />
                Last 24 Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {activityLogs?.filter(log => {
                  const logDate = new Date(log.created_at);
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  return logDate > yesterday;
                }).length || 0}
              </div>
              <p className="text-sm text-gray-500 mt-1">Recent activities</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Logins */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Logins</h2>
          {recentLogins && recentLogins.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLogins.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="font-medium">
                          {log.profiles ? 
                            `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim() || 
                            log.profiles.email : 
                            'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">{log.profiles?.role || 'N/A'}</div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell>{log.ip_address || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-gray-500">No recent login activities found.</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* All Activity Logs */}
        <h2 className="text-xl font-semibold mb-4">All Activity Logs</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading activity logs. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredLogs && filteredLogs.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>Comprehensive history of system activities.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityTypeColor(log.activity_type)}`}>
                        {log.activity_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {log.profiles ? 
                        `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim() || 
                        log.profiles.email : 
                        'Unknown User'}
                    </TableCell>
                    <TableCell>{format(new Date(log.created_at), 'MMM d, yyyy h:mm:ss a')}</TableCell>
                    <TableCell>{log.ip_address || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Activity Logs Found</h3>
              <p className="text-gray-500">
                There are no activity logs matching your search criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
