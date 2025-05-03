
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Plus, FileText, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

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

const ActivityFeed = () => {
  const { data: recentActivity, isLoading, error } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('activity_logs')
        .select(`
          *,
          user:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as ActivityLog[];
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        <Link 
          to="/admin/security" 
          className="text-sm text-meow-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">Failed to load activity</div>
        ) : recentActivity && recentActivity.length > 0 ? (
          recentActivity.slice(0, 5).map((activity) => (
            <div key={activity.id} className="py-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-gray-100/80 backdrop-blur-sm">
                  {activity.activity_type === 'login' && <User className="h-4 w-4 text-blue-500" />}
                  {activity.activity_type === 'logout' && <User className="h-4 w-4 text-gray-500" />}
                  {activity.activity_type === 'create' && <Plus className="h-4 w-4 text-green-500" />}
                  {activity.activity_type === 'update' && <FileText className="h-4 w-4 text-yellow-500" />}
                  {activity.activity_type === 'delete' && <FileText className="h-4 w-4 text-red-500" />}
                  {!activity.activity_type && <FileText className="h-4 w-4 text-purple-500" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {activity.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                    {activity.user && (
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {activity.user.email}
                      </span>
                    )}
                    <Badge variant="outline" className="capitalize bg-gray-100/80 text-gray-700 hover:bg-gray-100 hover:text-gray-700">
                      {activity.activity_type}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-gray-500">No recent activity</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
