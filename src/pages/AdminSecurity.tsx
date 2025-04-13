
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityLog {
  id: string;
  user_id: string | null;
  description: string;
  activity_type: string;
  created_at: string;
  ip_address: string | null;
  user_email?: string;
  user_name?: string;
}

const AdminSecurity: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch activity logs
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['activity-logs', page, activityFilter],
    queryFn: async () => {
      try {
        let query = supabase
          .from('activity_logs')
          .select('*, profiles!activity_logs_user_id_fkey(email, first_name, last_name)')
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);
          
        if (activityFilter) {
          query = query.eq('activity_type', activityFilter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return data.map(log => ({
          ...log,
          user_email: log.profiles?.email || 'System',
          user_name: log.profiles ? `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim() : 'System'
        })) as ActivityLog[];
      } catch (err) {
        console.error('Error fetching activity logs:', err);
        throw err;
      }
    }
  });

  // Filter logs based on search query
  const filteredLogs = data?.filter(log =>
    log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.user_email && log.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (log.user_name && log.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    log.activity_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get unique activity types for the filter
  const activityTypes = React.useMemo(() => {
    if (!data) return [];
    
    const types = new Set<string>();
    data.forEach(log => types.add(log.activity_type));
    return Array.from(types).sort();
  }, [data]);

  return (
    <AdminLayout title="Security">
      <SEO title="Security | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Activity Logs</h1>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            
            <Select
              value={activityFilter || ''}
              onValueChange={(value) => setActivityFilter(value === '' ? null : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All activities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All activities</SelectItem>
                {activityTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
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
              <>
                <div className="space-y-4">
                  {filteredLogs.map(log => (
                    <div key={log.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex flex-col md:flex-row justify-between mb-1">
                        <span className="font-semibold">{log.user_name || 'Unknown User'}</span>
                        <span className="text-sm text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-800">{log.description}</p>
                      <div className="flex justify-between mt-1 text-sm">
                        <span className="text-meow-primary">{log.activity_type}</span>
                        {log.ip_address && <span className="text-gray-500">IP: {log.ip_address}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">Page {page}</span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={!data || data.length < pageSize}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No activity logs found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
