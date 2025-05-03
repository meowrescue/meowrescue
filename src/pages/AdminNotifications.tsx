
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2 } from 'lucide-react';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  notification_type: string;
  related_id?: string;
  user_id: string;
}

const AdminNotifications: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  
  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', filter],
    queryFn: async () => {
      let query = getSupabaseClient()
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (filter === 'unread') {
        query = query.eq('is_read', false);
      } else if (filter === 'read') {
        query = query.eq('is_read', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Notification[];
    }
  });
  
  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabaseClient()
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'Success',
        description: 'Notification marked as read'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update notification',
        variant: 'destructive'
      });
    }
  });
  
  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabaseClient()
        .from('notifications')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'Success',
        description: 'Notification deleted'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete notification',
        variant: 'destructive'
      });
    }
  });
  
  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await getSupabaseClient()
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
        
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'Success',
        description: 'All notifications marked as read'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update notifications',
        variant: 'destructive'
      });
    }
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getNotificationBadgeVariant = (type: string) => {
    switch(type) {
      case 'application':
        return "default";
      case 'message':
        return "secondary";
      case 'event':
        return "outline";
      case 'cat':
        return "destructive";
      default:
        return "outline";
    }
  };
  
  return (
    <AdminLayout title="Notifications">
      <SEO title="Notifications | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Notifications</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex rounded-md overflow-hidden">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className="rounded-none rounded-l-md"
              >
                All
              </Button>
              <Button 
                variant={filter === 'unread' ? 'default' : 'outline'}
                onClick={() => setFilter('unread')}
                className="rounded-none"
              >
                Unread
              </Button>
              <Button 
                variant={filter === 'read' ? 'default' : 'outline'}
                onClick={() => setFilter('read')}
                className="rounded-none rounded-r-md"
              >
                Read
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending || !notifications?.some(n => !n.is_read)}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map(notification => (
              <Card 
                key={notification.id} 
                className={`hover:shadow-md transition-shadow ${!notification.is_read ? 'bg-gray-50 border-l-4 border-l-meow-primary' : ''}`}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-start gap-4 py-2">
                    <div className="bg-gray-100 rounded-full p-2">
                      <Bell className="h-5 w-5 text-meow-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Badge variant={getNotificationBadgeVariant(notification.notification_type)}>
                          {notification.notification_type.charAt(0).toUpperCase() + notification.notification_type.slice(1)}
                        </Badge>
                        {!notification.is_read && (
                          <Badge variant="destructive" className="bg-meow-secondary">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(notification.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!notification.is_read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAsReadMutation.mutate(notification.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteNotificationMutation.mutate(notification.id)}
                      disabled={deleteNotificationMutation.isPending}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-gray-700">No Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500">
                You don't have any {filter !== 'all' ? filter : ''} notifications at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
