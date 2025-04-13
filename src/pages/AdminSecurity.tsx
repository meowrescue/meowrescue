
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock, User, Shield, Activity, Filter } from 'lucide-react';
import SEO from '@/components/SEO';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ActivityLog } from '@/types/activity';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { capitalizeWords, capitalizeFirstLetter } from '@/utils/stringUtils';

const AdminSecurity: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const { toast } = useToast();

  // Fetch activity logs
  const { data: activityLogs, isLoading, error, refetch } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: async () => {
      try {
        // Modified query to avoid the relationship issue
        const { data: logsData, error: logsError } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (logsError) throw logsError;
        
        // For each log with a user_id, fetch the profile info separately
        const logsWithProfiles = await Promise.all(logsData.map(async (log) => {
          if (log.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('email, first_name, last_name, role')
              .eq('id', log.user_id)
              .single();
              
            return { ...log, profiles: profileData || null };
          }
          return { ...log, profiles: null };
        }));
        
        return logsWithProfiles as ActivityLog[];
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

  // Fetch unique users for filter dropdown
  const { data: uniqueUsers } = useQuery({
    queryKey: ['activity-log-users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .order('email', { ascending: true });
          
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Error fetching users:", err);
        return [];
      }
    }
  });

  // Get unique activity types from logs
  const uniqueActivityTypes = React.useMemo(() => {
    if (!activityLogs) return [];
    
    const types = new Set<string>();
    activityLogs.forEach(log => {
      if (log.activity_type) {
        types.add(log.activity_type.toLowerCase());
      }
    });
    
    return Array.from(types).sort();
  }, [activityLogs]);

  // Filter logs based on all criteria
  const filteredLogs = React.useMemo(() => {
    if (!activityLogs) return [];
    
    return activityLogs.filter(log => {
      // Text search filter
      const matchesSearch = searchQuery === '' || 
        log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.activity_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.profiles?.first_name && log.profiles?.last_name && 
          `${log.profiles.first_name} ${log.profiles.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Activity type filter
      const matchesType = activityTypeFilter === '' || activityTypeFilter === 'all' || 
        log.activity_type.toLowerCase() === activityTypeFilter.toLowerCase();
      
      // User filter
      const matchesUser = userFilter === '' || userFilter === 'all' || log.user_id === userFilter;
      
      return matchesSearch && matchesType && matchesUser;
    });
  }, [activityLogs, searchQuery, activityTypeFilter, userFilter]);

  const getActivityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'login': return 'bg-green-100 text-green-800';
      case 'logout': return 'bg-yellow-100 text-yellow-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'create': return 'bg-purple-100 text-purple-800';
      case 'chat': return 'bg-indigo-100 text-indigo-800';
      case 'message': return 'bg-teal-100 text-teal-800';
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

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setActivityTypeFilter('');
    setUserFilter('');
  };

  return (
    <AdminLayout title="Security & Logs">
      <SEO title="Security & Logs | Meow Rescue Admin" />
      
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-meow-primary">Security & Activity Logs</h1>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activity logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="w-full sm:w-auto">
            <Select 
              value={activityTypeFilter} 
              onValueChange={setActivityTypeFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activity Types</SelectItem>
                {uniqueActivityTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {capitalizeFirstLetter(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Select 
              value={userFilter} 
              onValueChange={setUserFilter}
            >
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers?.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name} (${user.email})`
                      : user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Activity className="mr-2 h-4 w-4 text-meow-primary" />
                Total Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activityLogs?.length || 0}</div>
              <p className="text-xs text-gray-500 mt-1">All recorded actions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <User className="mr-2 h-4 w-4 text-meow-primary" />
                Login Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countByType['login'] || 0}</div>
              <p className="text-xs text-gray-500 mt-1">User sign-ins</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Clock className="mr-2 h-4 w-4 text-meow-primary" />
                Last 24 Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activityLogs?.filter(log => {
                  const logDate = new Date(log.created_at);
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  return logDate > yesterday;
                }).length || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Recent activities</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Shield className="mr-2 h-4 w-4 text-meow-primary" />
                Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(countByType['login'] || 0) + (countByType['logout'] || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Login/logout events</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Activity Log Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableCaption>User activity and system security logs.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getActivityTypeColor(log.activity_type)}>
                        {capitalizeFirstLetter(log.activity_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {capitalizeWords(log.description)}
                    </TableCell>
                    <TableCell>
                      {log.profiles ? (
                        <div className="flex items-center">
                          <span>
                            {log.profiles.first_name && log.profiles.last_name
                              ? `${log.profiles.first_name} ${log.profiles.last_name}`
                              : log.profiles.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">System</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No activity logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
