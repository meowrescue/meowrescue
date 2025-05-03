
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent } from '@/components/ui/card';
import {
  Shield,
  Filter,
  Search,
  User,
  Calendar,
  ArrowDown,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  FileText,
  Plus,
  Star,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import SEO from '@/components/SEO';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch activity logs
  const { data: activityLogs, isLoading, error } = useQuery({
    queryKey: ['activity-logs', activityLimit, activityTypeFilter, userFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          user:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (activityTypeFilter !== 'all') {
        query = query.eq('activity_type', activityTypeFilter);
      }
      
      if (userFilter !== 'all') {
        query = query.eq('user_id', userFilter);
      }
      
      if (searchQuery) {
        query = query.ilike('description', `%${searchQuery}%`);
      }
      
      query = query.limit(activityLimit);
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data as ActivityLog[];
    }
  });

  // Fetch users for filter
  const { data: users } = useQuery({
    queryKey: ['security-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .order('email', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data;
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
        return <Plus className="h-5 w-5 text-green-500" />;
      case 'update':
        return <Edit className="h-5 w-5 text-yellow-500" />;
      case 'delete':
        return <Trash2 className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-purple-500" />;
    }
  };

  // Get unique activity types
  const activityTypes = activityLogs 
    ? [...new Set(activityLogs.map(log => log.activity_type))]
    : [];

  // Ensure there's always some data to display for testing
  const hasActivityLogs = activityLogs && activityLogs.length > 0;

  return (
    <AdminLayout title="Security">
      <SEO title="Security | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-meow-primary flex items-center">
              <Shield className="mr-2 h-7 w-7" />
              Security
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-white/10 backdrop-blur-sm border-gray-200/30"
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Select
                  value={activityTypeFilter}
                  onValueChange={setActivityTypeFilter}
                >
                  <SelectTrigger className="w-full sm:w-32 bg-white/10 backdrop-blur-sm border-gray-200/30">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {activityTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={userFilter}
                  onValueChange={setUserFilter}
                >
                  <SelectTrigger className="w-full sm:w-32 bg-white/10 backdrop-blur-sm border-gray-200/30">
                    <User className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users?.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
                </div>
              ) : error ? (
                <div className="py-8 text-center">
                  <Activity className="mx-auto h-8 w-8 text-red-500 mb-2" />
                  <p className="text-red-500 font-medium">Failed to load security logs</p>
                  <p className="text-gray-500 text-sm mt-1">Please try refreshing the page</p>
                </div>
              ) : hasActivityLogs ? (
                <div className="divide-y">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-gray-100/80 backdrop-blur-sm">
                          {getActivityIcon(log.activity_type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {log.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                            </span>
                            {log.user && (
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {log.user.email}
                              </span>
                            )}
                            <Badge variant="outline" className="capitalize bg-gray-100/80 text-gray-700 hover:bg-gray-100 hover:text-gray-700">
                              {log.activity_type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-lg font-medium text-gray-700 mb-1">No activity logs found</p>
                  <p className="text-gray-500 text-sm">
                    {searchQuery || activityTypeFilter !== 'all' || userFilter !== 'all'
                      ? 'Try adjusting your filters to see more results'
                      : 'Security activity will appear here when users perform actions'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {hasActivityLogs && activityLogs.length >= activityLimit && (
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setActivityLimit(prev => prev + 10)}
                className="gap-2 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white border-gray-200 shadow-sm"
              >
                <ArrowDown className="h-4 w-4" />
                Load More Logs
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
